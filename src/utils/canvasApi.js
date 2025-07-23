// Canvas API Integration
export class CanvasAPI {
  constructor(baseUrl, apiKey) {
    this.baseUrl = (baseUrl || 'https://canvas.asu.edu').replace(/\/$/, ''); // Remove trailing slash, default to ASU
    this.apiKey = apiKey;
    this.headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  async makeRequest(endpoint) {
    try {
      const url = `${this.baseUrl}/api/v1${endpoint}`;
      console.log('Canvas API Request:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`Canvas API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Canvas API Error:', error);
      return { success: false, error: error.message };
    }
  }

  async testConnection() {
    const result = await this.makeRequest('/users/self');
    return result;
  }

  async getCourses() {
    const result = await this.makeRequest('/courses?include[]=syllabus_body&enrollment_state=active');
    return result;
  }

  async getUpcomingEvents() {
    const result = await this.makeRequest('/users/self/upcoming_events');
    return result;
  }

  async getPlannerItems() {
    const result = await this.makeRequest('/planner/items');
    return result;
  }

  async getAssignments() {
    try {
      // Get active courses first
      const coursesResult = await this.getCourses();
      if (!coursesResult.success) {
        return coursesResult;
      }

      const courses = coursesResult.data;
      const allAssignments = [];

      // Fetch assignments for each course
      for (const course of courses) {
        const assignmentsResult = await this.makeRequest(`/courses/${course.id}/assignments`);
        if (assignmentsResult.success) {
          const assignments = assignmentsResult.data.map(assignment => ({
            id: assignment.id,
            name: assignment.name,
            description: assignment.description || 'No description provided',
            courseId: course.id,
            courseName: course.name,
            dueDate: assignment.due_at,
            pointsPossible: assignment.points_possible,
            htmlUrl: assignment.html_url,
            submissionTypes: assignment.submission_types || [],
            status: this.determineAssignmentStatus(assignment),
            type: this.determineAssignmentType(assignment),
            priority: this.determineAssignmentPriority(assignment)
          }));
          
          allAssignments.push(...assignments);
        }
      }

      // Sort by due date
      allAssignments.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });

      return { success: true, data: allAssignments };
    } catch (error) {
      console.error('Error fetching assignments:', error);
      return { success: false, error: error.message };
    }
  }

  determineAssignmentStatus(assignment) {
    const now = new Date();
    const dueDate = assignment.due_at ? new Date(assignment.due_at) : null;
    
    if (assignment.has_submitted_submissions) {
      return 'completed';
    }
    
    if (dueDate && dueDate < now) {
      return 'overdue';
    }
    
    if (dueDate && dueDate <= new Date(now.getTime() + 24 * 60 * 60 * 1000)) {
      return 'due-soon';
    }
    
    return 'pending';
  }

  determineAssignmentType(assignment) {
    const name = assignment.name.toLowerCase();
    const description = (assignment.description || '').toLowerCase();
    
    if (name.includes('essay') || name.includes('paper') || description.includes('essay')) {
      return 'essay';
    }
    
    if (name.includes('discussion') || name.includes('forum') || description.includes('discussion')) {
      return 'discussion';
    }
    
    if (name.includes('quiz') || name.includes('test') || name.includes('exam')) {
      return 'quiz';
    }
    
    if (name.includes('project') || description.includes('project')) {
      return 'project';
    }
    
    return 'assignment';
  }

  determineAssignmentPriority(assignment) {
    const now = new Date();
    const dueDate = assignment.due_at ? new Date(assignment.due_at) : null;
    
    if (!dueDate) return 'low';
    
    const daysUntilDue = (dueDate - now) / (1000 * 60 * 60 * 24);
    
    if (daysUntilDue < 0) return 'high'; // Overdue
    if (daysUntilDue <= 1) return 'high'; // Due within 1 day
    if (daysUntilDue <= 3) return 'medium'; // Due within 3 days
    
    return 'low';
  }
}

// Helper function to create Canvas API instance
export const createCanvasAPI = (baseUrl, apiKey) => {
  if (!baseUrl || !apiKey) {
    throw new Error('Canvas base URL and API key are required');
  }
  return new CanvasAPI(baseUrl, apiKey);
}; 