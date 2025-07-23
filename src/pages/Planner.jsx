import { motion } from 'framer-motion';
import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, parseISO } from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  Circle,
  Trash2,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import useStore from '../state/useStore';

const Planner = () => {
  const { 
    assignments, 
    plannedTasks, 
    addPlannedTask, 
    toggleTaskComplete, 
    deletePlannedTask 
  } = useStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '',
    priority: 'medium',
    type: 'study'
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAssignmentsForDate = (date) => {
    return assignments.filter(assignment => 
      isSameDay(parseISO(assignment.dueDate), date)
    );
  };

  const getTasksForDate = (date) => {
    return plannedTasks.filter(task => 
      isSameDay(new Date(task.date), date)
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      addPlannedTask({
        ...newTask,
        completed: false,
        createdAt: new Date().toISOString()
      });
      setNewTask({
        title: '',
        description: '',
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: '',
        priority: 'medium',
        type: 'study'
      });
      setShowAddTask(false);
    }
  };

  const selectedDateTasks = getTasksForDate(selectedDate);
  const selectedDateAssignments = getAssignmentsForDate(selectedDate);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Study Planner
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Plan your study schedule and track assignment deadlines
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="card">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </motion.button>
                  <motion.button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900/20 text-primary-600 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/30 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Today
                  </motion.button>
                  <motion.button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </motion.button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                    {day}
                  </div>
                ))}

                {/* Calendar Days */}
                {calendarDays.map(day => {
                  const dayAssignments = getAssignmentsForDate(day);
                  const dayTasks = getTasksForDate(day);
                  const hasEvents = dayAssignments.length > 0 || dayTasks.length > 0;
                  const isSelected = isSameDay(day, selectedDate);
                  const isCurrentMonth = isSameMonth(day, currentDate);

                  return (
                    <motion.button
                      key={day.toISOString()}
                      onClick={() => setSelectedDate(day)}
                      className={`p-3 min-h-[80px] text-left border border-gray-200 dark:border-dark-600 transition-all ${
                        isSelected ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300' :
                        isToday(day) ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300' :
                        isCurrentMonth ? 'hover:bg-gray-50 dark:hover:bg-dark-700' :
                        'text-gray-400 dark:text-gray-600'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="font-medium mb-1">
                        {format(day, 'd')}
                      </div>
                      {hasEvents && (
                        <div className="space-y-1">
                          {dayAssignments.slice(0, 2).map((assignment, index) => (
                            <div key={index} className="text-xs bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 px-1 py-0.5 rounded truncate">
                              {assignment.title}
                            </div>
                          ))}
                          {dayTasks.slice(0, 2 - dayAssignments.length).map((task, index) => (
                            <div key={index} className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-1 py-0.5 rounded truncate">
                              {task.title}
                            </div>
                          ))}
                          {(dayAssignments.length + dayTasks.length) > 2 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              +{(dayAssignments.length + dayTasks.length) - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Selected Date */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {format(selectedDate, 'EEEE, MMM d')}
                </h3>
                <motion.button
                  onClick={() => setShowAddTask(true)}
                  className="btn-primary text-sm flex items-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Task
                </motion.button>
              </div>

              {/* Assignments for Selected Date */}
              {selectedDateAssignments.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                    Due Today
                  </h4>
                  <div className="space-y-2">
                    {selectedDateAssignments.map(assignment => (
                      <div key={assignment.id} className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
                        <h5 className="font-medium text-red-900 dark:text-red-300 text-sm">
                          {assignment.title}
                        </h5>
                        <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                          {assignment.course} • {assignment.type}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks for Selected Date */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Tasks
                </h4>
                {selectedDateTasks.length === 0 ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No tasks planned for this day
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedDateTasks.map(task => (
                      <motion.div 
                        key={task.id}
                        className={`p-3 rounded-lg border transition-all ${
                          task.completed 
                            ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60' 
                            : 'bg-white dark:bg-dark-700 border-gray-200 dark:border-dark-600'
                        }`}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <button
                              onClick={() => toggleTaskComplete(task.id)}
                              className="mt-0.5"
                            >
                              {task.completed ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Circle className="h-4 w-4 text-gray-400" />
                              )}
                            </button>
                            <div className="flex-1">
                              <h5 className={`font-medium text-sm ${
                                task.completed 
                                  ? 'line-through text-gray-500 dark:text-gray-400' 
                                  : 'text-gray-900 dark:text-white'
                              }`}>
                                {task.title}
                              </h5>
                              {task.description && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                  {task.description}
                                </p>
                              )}
                              <div className="flex items-center space-x-2 mt-2">
                                {task.time && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {task.time}
                                  </span>
                                )}
                                <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => deletePlannedTask(task.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                This Week
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {plannedTasks.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                  <span className="font-medium text-green-600">
                    {plannedTasks.filter(t => t.completed).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Assignments Due</span>
                  <span className="font-medium text-red-600">
                    {assignments.filter(a => a.status === 'pending').length}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Add Task Modal */}
        {showAddTask && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddTask(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-dark-800 rounded-xl p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Add New Task
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="input-field"
                    placeholder="What do you need to do?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="input-field resize-none"
                    rows="2"
                    placeholder="Additional details..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={newTask.date}
                      onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Time (optional)
                    </label>
                    <input
                      type="time"
                      value={newTask.time}
                      onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="input-field"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <motion.button
                    onClick={() => setShowAddTask(false)}
                    className="btn-secondary flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleAddTask}
                    className="btn-primary flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add Task
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Planner; 