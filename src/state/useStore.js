import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createCanvasAPI } from '../utils/canvasApi';
import { createGPTAPI, CONTENT_TYPES, VIBE_MODES } from '../utils/gptApi';
import useAuthStore from './useAuthStore';

// Mock assignment data
const mockAssignments = [
  {
    id: '1',
    title: 'Philosophy Essay: Free Will vs Determinism',
    description: 'Write a 1500-word essay comparing free will and determinism perspectives',
    dueDate: '2024-08-15T23:59:00Z',
    course: 'PHIL 101',
    type: 'essay',
    status: 'pending',
    priority: 'high',
    estimatedTime: '4 hours'
  },
  {
    id: '2',
    title: 'Discussion Post: Climate Change Solutions',
    description: 'Respond to the prompt about innovative climate solutions (300 words minimum)',
    dueDate: '2024-08-10T11:59:00Z',
    course: 'ENVS 200',
    type: 'discussion',
    status: 'in-progress',
    priority: 'medium',
    estimatedTime: '30 minutes'
  },
  {
    id: '3',
    title: 'Math Problem Set Chapter 8',
    description: 'Complete problems 1-25 from Chapter 8: Calculus Applications',
    dueDate: '2024-08-18T16:00:00Z',
    course: 'MATH 251',
    type: 'problem-set',
    status: 'pending',
    priority: 'medium',
    estimatedTime: '2 hours'
  },
  {
    id: '4',
    title: 'Email Professor About Research Project',
    description: 'Request meeting to discuss research project proposal guidelines',
    dueDate: '2024-08-12T17:00:00Z',
    course: 'BIOL 350',
    type: 'email',
    status: 'pending',
    priority: 'low',
    estimatedTime: '15 minutes'
  },
  {
    id: '5',
    title: 'Study Guide: Organic Chemistry Midterm',
    description: 'Create comprehensive study guide for upcoming midterm exam',
    dueDate: '2024-08-20T09:00:00Z',
    course: 'CHEM 261',
    type: 'study-guide',
    status: 'pending',
    priority: 'high',
    estimatedTime: '3 hours'
  }
];

const useStore = create(
  persist(
    (set, get) => ({
      // Theme state (default to dark mode for hacker theme)
      isDarkMode: true,
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      // User settings
      vibeMode: 'classic-student', // 'classic-student', 'lazy-genius'
      setVibeMode: (mode) => set({ vibeMode: mode }),

      // Assignment state
      assignments: mockAssignments,
      currentAssignment: null,
      setCurrentAssignment: (assignment) => set({ currentAssignment: assignment }),
      updateAssignmentStatus: (id, status) => set((state) => ({
        assignments: state.assignments.map(assignment =>
          assignment.id === id ? { ...assignment, status } : assignment
        )
      })),

      // Workspace state
      workspaceContent: '',
      workspaceTitle: '',
      workspaceType: '', // 'essay', 'discussion', 'email', 'study-guide'
      isGenerating: false,
      setWorkspaceContent: (content) => set({ workspaceContent: content }),
      setWorkspaceTitle: (title) => set({ workspaceTitle: title }),
      setWorkspaceType: (type) => set({ workspaceType: type }),
      setIsGenerating: (isGenerating) => set({ isGenerating }),

      // Canvas integration
      isCanvasConnected: false,
      canvasError: null,
      isConnectingCanvas: false,
      isFetchingAssignments: false,
      lastCanvasSync: null,
      syncSuccessMessage: null,
      
      setCanvasConnected: (connected) => set({ isCanvasConnected: connected }),
      
      clearSyncMessage: () => set({ syncSuccessMessage: null }),

      connectCanvas: async () => {
        const authStore = useAuthStore.getState();
        const canvasBaseUrl = authStore.getCanvasBaseUrl();
        const canvasKey = authStore.getCanvasKey();
        
        if (!canvasKey) {
          set({ canvasError: 'Canvas API token is required. Please add it in Settings.' });
          return false;
        }

        set({ isConnectingCanvas: true, canvasError: null });

        try {
          const canvasAPI = createCanvasAPI(canvasBaseUrl, canvasKey);
          const result = await canvasAPI.testConnection();
          
          if (result.success) {
            set({ 
              isCanvasConnected: true, 
              canvasError: null,
              lastCanvasSync: new Date().toISOString()
            });
            return true;
          } else {
            set({ 
              isCanvasConnected: false, 
              canvasError: result.error || 'Failed to connect to Canvas'
            });
            return false;
          }
        } catch (error) {
          set({ 
            isCanvasConnected: false, 
            canvasError: error.message 
          });
          return false;
        } finally {
          set({ isConnectingCanvas: false });
        }
      },

      fetchCanvasAssignments: async () => {
        const authStore = useAuthStore.getState();
        const canvasBaseUrl = authStore.getCanvasBaseUrl();
        const canvasKey = authStore.getCanvasKey();
        
        // Clear any previous messages
        set({ syncSuccessMessage: null, canvasError: null });
        
        if (!canvasKey) {
          set({ canvasError: 'Canvas API token is required. Go to Settings to add it.' });
          return false;
        }

        set({ isFetchingAssignments: true });

        try {
          const canvasAPI = createCanvasAPI(canvasBaseUrl, canvasKey);
          const result = await canvasAPI.getAssignments();
          
          if (result.success) {
            // Transform Canvas data to match our assignment format
            const transformedAssignments = result.data.map(assignment => ({
              id: assignment.id.toString(),
              title: assignment.name,
              description: assignment.description,
              dueDate: assignment.dueDate,
              course: assignment.courseName,
              type: assignment.type,
              status: assignment.status,
              priority: assignment.priority,
              estimatedTime: '2 hours', // Default estimate
              canvasUrl: assignment.htmlUrl,
              pointsPossible: assignment.pointsPossible
            }));

            const count = transformedAssignments.length;
            set({ 
              assignments: transformedAssignments,
              lastCanvasSync: new Date().toISOString(),
              canvasError: null,
              isCanvasConnected: true,
              syncSuccessMessage: `Successfully synced ${count} assignment${count !== 1 ? 's' : ''} from Canvas`
            });
            
            // Clear success message after 5 seconds
            setTimeout(() => {
              set({ syncSuccessMessage: null });
            }, 5000);
            
            return true;
          } else {
            set({ canvasError: result.error || 'Unable to connect to Canvas — check your API token in Settings' });
            return false;
          }
        } catch (error) {
          set({ canvasError: 'Unable to connect to Canvas — check your API token in Settings' });
          return false;
        } finally {
          set({ isFetchingAssignments: false });
        }
      },

      // GPT API integration
      gptError: null,
      isTestingGPT: false,

      testGPTConnection: async () => {
        const authStore = useAuthStore.getState();
        const gptKey = authStore.getGptKey();
        
        if (!gptKey) {
          set({ gptError: 'OpenAI GPT API key is required. Please add it in Settings.' });
          return false;
        }

        set({ isTestingGPT: true, gptError: null });

        try {
          const gptAPI = createGPTAPI(gptKey);
          const result = await gptAPI.testConnection();
          
          if (result.success) {
            set({ gptError: null });
            return true;
          } else {
            set({ gptError: result.error || 'Failed to connect to OpenAI GPT API' });
            return false;
          }
        } catch (error) {
          set({ gptError: error.message });
          return false;
        } finally {
          set({ isTestingGPT: false });
        }
      },

      // Check if user has required keys
      checkRequiredKeys: () => {
        const authStore = useAuthStore.getState();
        if (!authStore.hasGptKey()) {
          set({ gptError: 'Missing OpenAI GPT key. Go to Settings to add it.' });
          return false;
        }
        if (!authStore.hasCanvasKey()) {
          set({ canvasError: 'Missing Canvas API token. Go to Settings to add it.' });
          return false;
        }
        return true;
      },

      // Planner state
      plannedTasks: [],
      addPlannedTask: (task) => set((state) => ({
        plannedTasks: [...state.plannedTasks, { ...task, id: Date.now().toString() }]
      })),
      toggleTaskComplete: (id) => set((state) => ({
        plannedTasks: state.plannedTasks.map(task =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      })),
      deletePlannedTask: (id) => set((state) => ({
        plannedTasks: state.plannedTasks.filter(task => task.id !== id)
      })),

      // Navigation state
      currentPage: 'landing',
      setCurrentPage: (page) => set({ currentPage: page }),

      // AI Generation functions with real GPT API
      generateContent: async (assignment, customVibeMode = null) => {
        const { vibeMode: storeVibeMode } = get();
        const authStore = useAuthStore.getState();
        const gptKey = authStore.getGptKey();
        
        if (!gptKey) {
          set({ gptError: 'OpenAI GPT API key is required. Go to Settings to add it.' });
          return null;
        }

        set({ isGenerating: true, gptError: null });

        try {
          const gptAPI = createGPTAPI(gptKey);
          
          // Map vibe modes
          const vibeMode = customVibeMode || storeVibeMode;
          const mappedVibeMode = vibeMode === 'classic-student' || vibeMode === 'Classic Student' 
            ? VIBE_MODES.CLASSIC 
            : VIBE_MODES.LAZY;

          // Map assignment types to GPT content types
          const contentTypeMap = {
            'essay': CONTENT_TYPES.ESSAY,
            'discussion': CONTENT_TYPES.DISCUSSION,
            'email': CONTENT_TYPES.EMAIL,
            'study-guide': CONTENT_TYPES.STUDY_GUIDE,
            'problem-set': CONTENT_TYPES.ASSIGNMENT,
            'assignment': CONTENT_TYPES.ASSIGNMENT
          };

          const contentType = contentTypeMap[assignment.type] || CONTENT_TYPES.ASSIGNMENT;
          
          // Create prompt from assignment
          const prompt = `Assignment: ${assignment.title}

Description: ${assignment.description}

Course: ${assignment.course}
${assignment.dueDate ? `Due Date: ${new Date(assignment.dueDate).toLocaleDateString()}` : ''}
${assignment.pointsPossible ? `Points: ${assignment.pointsPossible}` : ''}

Please provide a comprehensive response that meets all requirements.`;

          const result = await gptAPI.generateContent(prompt, contentType, mappedVibeMode);
          
          if (result.success) {
            const generationData = {
              content: result.content,
              assignment,
              contentType,
              vibeMode: mappedVibeMode,
              generatedAt: result.metadata.generatedAt,
              metadata: result.metadata
            };

            set({
              workspaceContent: result.content,
              workspaceTitle: assignment.title,
              workspaceType: assignment.type,
              currentAssignment: assignment,
              isGenerating: false,
              gptError: null,
              lastGeneratedContent: generationData
            });
            
            // Add to recent generations
            get().addRecentGeneration(generationData);
            
            return result.content;
          } else {
            set({ 
              gptError: result.error || 'Failed to generate content',
              isGenerating: false 
            });
            return null;
          }
        } catch (error) {
          console.error('Error generating content:', error);
          set({ 
            gptError: error.message,
            isGenerating: false 
          });
          return null;
        }
      },

      generateCustomContent: async (prompt, contentType = CONTENT_TYPES.ASSIGNMENT) => {
        const { vibeMode } = get();
        const authStore = useAuthStore.getState();
        const gptKey = authStore.getGptKey();
        
        if (!gptKey) {
          set({ gptError: 'OpenAI GPT API key is required. Go to Settings to add it.' });
          return null;
        }

        set({ isGenerating: true, gptError: null });

        try {
          const gptAPI = createGPTAPI(gptKey);
          const mappedVibeMode = vibeMode === 'classic-student' || vibeMode === 'Classic Student' 
            ? VIBE_MODES.CLASSIC 
            : VIBE_MODES.LAZY;

          const result = await gptAPI.generateContent(prompt, contentType, mappedVibeMode);
          
          if (result.success) {
            set({
              workspaceContent: result.content,
              workspaceTitle: 'Custom Generation',
              workspaceType: contentType,
              isGenerating: false,
              gptError: null,
              lastGeneratedContent: {
                content: result.content,
                prompt,
                contentType,
                vibeMode: mappedVibeMode,
                generatedAt: result.metadata.generatedAt,
                metadata: result.metadata
              }
            });
            
            return result.content;
          } else {
            set({ 
              gptError: result.error || 'Failed to generate content',
              isGenerating: false 
            });
            return null;
          }
        } catch (error) {
          console.error('Error generating content:', error);
          set({ 
            gptError: error.message,
            isGenerating: false 
          });
          return null;
        }
      },

      // Recent Generations History
      recentGenerations: [],
      addRecentGeneration: (generation) => set((state) => ({
        recentGenerations: [
          generation,
          ...state.recentGenerations.slice(0, 9) // Keep last 10
        ]
      })),
      clearRecentGenerations: () => set({ recentGenerations: [] }),

      // Utility functions
      lastGeneratedContent: null,
      clearErrors: () => set({ canvasError: null, claudeError: null }),

      // Assignment management enhancements
      markAssignmentCompleted: (assignmentId) => set((state) => ({
        assignments: state.assignments.map(assignment =>
          assignment.id === assignmentId 
            ? { ...assignment, status: 'completed' }
            : assignment
        )
      })),

      // Reminders
      reminders: [],
      addReminder: (assignmentId, reminderDate) => set((state) => ({
        reminders: [
          ...state.reminders,
          {
            id: Date.now().toString(),
            assignmentId,
            reminderDate,
            active: true
          }
        ]
      })),
      removeReminder: (reminderId) => set((state) => ({
        reminders: state.reminders.filter(r => r.id !== reminderId)
      }))
    }),
    {
      name: 'homeworkbot-storage',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        vibeMode: state.vibeMode,
        isCanvasConnected: state.isCanvasConnected,
        plannedTasks: state.plannedTasks,
        assignments: state.assignments,
        recentGenerations: state.recentGenerations,
        reminders: state.reminders
      })
    }
  )
);

export default useStore; 