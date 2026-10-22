import React, { useState } from 'react';
import { usePlanora } from '../../context/PlanoraContext';
import {
  CalendarDays,
  PlusCircle,
  AlertCircle,
  Clock,
  Trash2,
  Calendar,
  X,
  Check,
} from 'lucide-react';
import { MilestoneCategory, TaskPriority, TimelineTask } from '../../types';

const MILESTONE_LABELS: Record<MilestoneCategory, string> = {
  '6_months_plus': '6+ Months Out (Foundation & Venue)',
  '3_to_6_months': '3 to 6 Months Out (Core Vendors & Styling)',
  '1_to_3_months': '1 to 3 Months Out (Invites & Tasting)',
  '2_to_4_weeks': '2 to 4 Weeks Out (Headcounts & Logistics)',
  'week_of': 'Week of Event (Final Coordination)',
  'day_of': 'Event Day (Execution & Flow)',
  'post_event': 'Post-Event (Settlements & Teardown)',
};

export const TimelineTab: React.FC = () => {
  const {
    activePlan,
    toggleTaskComplete,
    addCustomTask,
    deleteTask,
    shiftEventDate,
  } = usePlanora();

  const { intake, timeline } = activePlan;

  const [milestoneFilter, setMilestoneFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');

  // Date Shifter State
  const [isShiftingDate, setIsShiftingDate] = useState(false);
  const [newDateInput, setNewDateInput] = useState(intake.date);

  // Add Task Modal State
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Planning');
  const [newTaskMilestone, setNewTaskMilestone] = useState<MilestoneCategory>('1_to_3_months');
  const [newTaskDueDate, setNewTaskDueDate] = useState(intake.date);
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('high');
  const [newTaskOwner, setNewTaskOwner] = useState('Host');
  const [newTaskNotes, setNewTaskNotes] = useState('');

  const handleDateShiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDateInput) return;
    shiftEventDate(newDateInput);
    setIsShiftingDate(false);
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addCustomTask({
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      milestone: newTaskMilestone,
      dueDate: newTaskDueDate,
      relativeOffsetDays: 0,
      priority: newTaskPriority,
      owner: newTaskOwner.trim() || 'Coordinator',
      completed: false,
      notes: newTaskNotes.trim() || undefined,
    });

    setNewTaskTitle('');
    setNewTaskNotes('');
    setShowAddTaskModal(false);
  };

  // Filter tasks
  const filteredTasks = timeline.filter(t => {
    if (milestoneFilter !== 'all' && t.milestone !== milestoneFilter) return false;
    if (statusFilter === 'pending' && t.completed) return false;
    if (statusFilter === 'completed' && !t.completed) return false;
    if (statusFilter === 'overdue' && (!t.isOverdue || t.completed)) return false;
    return true;
  });

  // Group by milestone
  const milestonesOrder: MilestoneCategory[] = [
    '6_months_plus',
    '3_to_6_months',
    '1_to_3_months',
    '2_to_4_weeks',
    'week_of',
    'day_of',
    'post_event',
  ];

  const grouped = milestonesOrder.reduce((acc, ms) => {
    const list = filteredTasks.filter(t => t.milestone === ms);
    if (list.length > 0) {
      acc[ms] = list;
    }
    return acc;
  }, {} as Record<MilestoneCategory, TimelineTask[]>);

  const totalTasks = timeline.length;
  const completedCount = timeline.filter(t => t.completed).length;
  const overdueCount = timeline.filter(t => t.isOverdue && !t.completed).length;

  return (
    <div style={containerStyle}>
      {/* Timeline Controls Header */}
      <div style={headerCardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={labelStyle}>Target Event Date</span>
              <button
                onClick={() => {
                  setNewDateInput(intake.date);
                  setIsShiftingDate(!isShiftingDate);
                }}
                style={shiftDateButtonStyle}
              >
                <Calendar size={13} />
                <span>Shift Date</span>
              </button>
            </div>

            {isShiftingDate ? (
              <form onSubmit={handleDateShiftSubmit} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <input
                  type="date"
                  required
                  value={newDateInput}
                  onChange={e => setNewDateInput(e.target.value)}
                  style={dateInputStyle}
                />
                <button type="submit" style={saveSmallButtonStyle} aria-label="Confirm Date Shift">
                  <Check size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsShiftingDate(false)}
                  style={cancelSmallButtonStyle}
                  aria-label="Cancel"
                >
                  <X size={14} />
                </button>
              </form>
            ) : (
              <div style={mainDateStyle}>
                {intake.date} {intake.isApproximateDate ? '(Approximate Timeframe)' : ''}
              </div>
            )}

            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Shifting the event date automatically recalculates all vendor booking deadlines backward!
            </div>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={metricChipStyle}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Progress:</span>
              <span style={{ fontWeight: 800, fontSize: '14px' }}>
                {completedCount} / {totalTasks} Completed
              </span>
            </div>

            {overdueCount > 0 && (
              <div style={{ ...metricChipStyle, backgroundColor: 'var(--status-danger-bg)', borderColor: 'var(--status-danger)' }}>
                <AlertCircle size={14} color="var(--status-danger)" />
                <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--status-danger)' }}>
                  {overdueCount} Overdue
                </span>
              </div>
            )}

            <button onClick={() => setShowAddTaskModal(true)} style={primaryAddButtonStyle}>
              <PlusCircle size={15} />
              <span>Add Custom Task</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div style={filterToolbarStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginRight: '4px' }}>
              Status:
            </span>
            <button
              onClick={() => setStatusFilter('all')}
              style={{
                ...filterBtnStyle,
                backgroundColor: statusFilter === 'all' ? 'var(--color-primary)' : 'var(--bg-card-muted)',
                color: statusFilter === 'all' ? '#ffffff' : 'var(--text-secondary)',
              }}
            >
              All ({totalTasks})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              style={{
                ...filterBtnStyle,
                backgroundColor: statusFilter === 'pending' ? 'var(--color-primary)' : 'var(--bg-card-muted)',
                color: statusFilter === 'pending' ? '#ffffff' : 'var(--text-secondary)',
              }}
            >
              Pending ({totalTasks - completedCount})
            </button>
            <button
              onClick={() => setStatusFilter('overdue')}
              style={{
                ...filterBtnStyle,
                backgroundColor: statusFilter === 'overdue' ? 'var(--status-danger)' : 'var(--bg-card-muted)',
                color: statusFilter === 'overdue' ? '#ffffff' : 'var(--text-secondary)',
              }}
            >
              Overdue ({overdueCount})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              style={{
                ...filterBtnStyle,
                backgroundColor: statusFilter === 'completed' ? 'var(--status-success)' : 'var(--bg-card-muted)',
                color: statusFilter === 'completed' ? '#ffffff' : 'var(--text-secondary)',
              }}
            >
              Completed ({completedCount})
            </button>
          </div>

          <div>
            <select
              value={milestoneFilter}
              onChange={e => setMilestoneFilter(e.target.value)}
              style={selectDropdownStyle}
              aria-label="Filter by milestone timeframe"
            >
              <option value="all">All Milestone Phases</option>
              {milestonesOrder.map(ms => (
                <option key={ms} value={ms}>
                  {MILESTONE_LABELS[ms]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grouped Milestone Task Lists */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px' }}>
        {Object.keys(grouped).length === 0 ? (
          <div style={emptyCardStyle}>No tasks match your selected filter criteria.</div>
        ) : (
          milestonesOrder.map(ms => {
            const tasksInGroup = grouped[ms];
            if (!tasksInGroup) return null;

            return (
              <div key={ms} style={milestoneGroupCardStyle}>
                <div style={milestoneHeaderStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CalendarDays size={18} color="var(--color-primary)" />
                    <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {MILESTONE_LABELS[ms]}
                    </h2>
                  </div>
                  <span style={countPillStyle}>{tasksInGroup.length} Tasks</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                  {tasksInGroup.map(task => (
                    <div
                      key={task.id}
                      style={{
                        ...taskCardStyle,
                        borderColor: task.completed ? 'var(--border-color)' : task.isOverdue ? 'var(--status-danger)' : 'var(--border-color)',
                        opacity: task.completed ? 0.75 : 1,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskComplete(task.id)}
                        style={checkboxStyle}
                        aria-label={`Mark task ${task.title} complete`}
                      />

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span
                            style={{
                              fontWeight: 600,
                              fontSize: '14px',
                              color: 'var(--text-primary)',
                              textDecoration: task.completed ? 'line-through' : 'none',
                            }}
                          >
                            {task.title}
                          </span>
                          {task.isOverdue && !task.completed && (
                            <span style={overdueBadgeStyle}>Overdue Action</span>
                          )}
                          <span style={priorityBadgeStyle(task.priority)}>
                            {task.priority.toUpperCase()}
                          </span>
                          <span style={categoryBadgeStyle}>{task.category}</span>
                          {task.isCustom && <span style={customBadgeStyle}>Custom</span>}
                        </div>

                        {task.notes && (
                          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            {task.notes}
                          </p>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} />
                            Due: <strong>{task.dueDate}</strong>
                          </span>
                          <span>Owner: <strong>{task.owner}</strong></span>
                        </div>
                      </div>

                      {task.isCustom && (
                        <button
                          onClick={() => deleteTask(task.id)}
                          style={deleteIconButtonStyle}
                          title="Delete custom task"
                          aria-label={`Delete custom task ${task.title}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div style={modalBackdropStyle}>
          <div style={modalContentStyle}>
            <div style={modalHeaderStyle}>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Add Custom Timeline Milestone</h3>
              <button
                onClick={() => setShowAddTaskModal(false)}
                style={iconCloseButtonStyle}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddTaskSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
              <div>
                <label style={formLabelStyle}>Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule Bridal Mehndi & Henna Session"
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  style={formInputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={formLabelStyle}>Category</label>
                  <input
                    type="text"
                    value={newTaskCategory}
                    onChange={e => setNewTaskCategory(e.target.value)}
                    style={formInputStyle}
                  />
                </div>
                <div>
                  <label style={formLabelStyle}>Owner / Assignee</label>
                  <input
                    type="text"
                    value={newTaskOwner}
                    onChange={e => setNewTaskOwner(e.target.value)}
                    style={formInputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={formLabelStyle}>Milestone Group</label>
                  <select
                    value={newTaskMilestone}
                    onChange={e => setNewTaskMilestone(e.target.value as MilestoneCategory)}
                    style={formInputStyle}
                  >
                    {milestonesOrder.map(ms => (
                      <option key={ms} value={ms}>
                        {MILESTONE_LABELS[ms]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={formLabelStyle}>Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={e => setNewTaskPriority(e.target.value as TaskPriority)}
                    style={formInputStyle}
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={formLabelStyle}>Due Date *</label>
                <input
                  type="date"
                  required
                  value={newTaskDueDate}
                  onChange={e => setNewTaskDueDate(e.target.value)}
                  style={formInputStyle}
                />
              </div>

              <div>
                <label style={formLabelStyle}>Notes / Description</label>
                <textarea
                  rows={2}
                  placeholder="Additional context or requirements..."
                  value={newTaskNotes}
                  onChange={e => setNewTaskNotes(e.target.value)}
                  style={{ ...formInputStyle, resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  style={cancelButtonStyle}
                >
                  Cancel
                </button>
                <button type="submit" style={submitButtonStyle}>
                  Add Milestone Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const containerStyle: React.CSSProperties = {
  maxWidth: '1440px',
  margin: '0 auto',
  padding: '24px',
};

const headerCardStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-lg)',
  padding: '24px',
  boxShadow: 'var(--shadow-sm)',
};

const labelStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: 'var(--text-muted)',
};

const shiftDateButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  background: 'none',
  border: 'none',
  color: 'var(--color-primary)',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
  padding: '2px 6px',
};

const mainDateStyle: React.CSSProperties = {
  fontSize: '26px',
  fontWeight: 800,
  letterSpacing: '-0.02em',
  color: 'var(--text-primary)',
  marginTop: '2px',
};

const dateInputStyle: React.CSSProperties = {
  padding: '6px 10px',
  fontSize: '14px',
  fontWeight: 600,
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-input)',
};

const saveSmallButtonStyle: React.CSSProperties = {
  backgroundColor: 'var(--status-success)',
  color: '#ffffff',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  padding: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const cancelSmallButtonStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-card-muted)',
  color: 'var(--text-secondary)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  padding: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const metricChipStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 14px',
  backgroundColor: 'var(--bg-card-muted)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-md)',
};

const primaryAddButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 16px',
  backgroundColor: 'var(--color-primary)',
  color: '#ffffff',
  border: 'none',
  borderRadius: 'var(--radius-md)',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
};

const filterToolbarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '12px',
  marginTop: '20px',
  paddingTop: '16px',
  borderTop: '1px solid var(--border-color)',
};

const filterBtnStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  padding: '4px 10px',
  borderRadius: '16px',
  border: 'none',
  cursor: 'pointer',
};

const selectDropdownStyle: React.CSSProperties = {
  padding: '6px 12px',
  fontSize: '12px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-card)',
  color: 'var(--text-primary)',
};

const milestoneGroupCardStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-lg)',
  padding: '20px',
  boxShadow: 'var(--shadow-sm)',
};

const milestoneHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const countPillStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  backgroundColor: 'var(--bg-card-muted)',
  color: 'var(--text-secondary)',
  padding: '2px 8px',
  borderRadius: '12px',
};

const taskCardStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  padding: '12px 14px',
  backgroundColor: 'var(--bg-card-muted)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-md)',
};

const checkboxStyle: React.CSSProperties = {
  width: '18px',
  height: '18px',
  marginTop: '2px',
  accentColor: 'var(--color-primary)',
  cursor: 'pointer',
};

const overdueBadgeStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  padding: '1px 6px',
  borderRadius: '4px',
  backgroundColor: 'var(--status-danger-bg)',
  color: 'var(--status-danger)',
};

const priorityBadgeStyle = (priority: TaskPriority): React.CSSProperties => {
  const isCrit = priority === 'critical';
  const isHigh = priority === 'high';
  return {
    fontSize: '10px',
    fontWeight: 700,
    padding: '1px 6px',
    borderRadius: '4px',
    backgroundColor: isCrit ? 'var(--status-danger-bg)' : isHigh ? 'var(--status-warning-bg)' : 'var(--bg-card)',
    color: isCrit ? 'var(--status-danger)' : isHigh ? 'var(--status-warning)' : 'var(--text-muted)',
  };
};

const categoryBadgeStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 600,
  backgroundColor: 'var(--bg-card)',
  color: 'var(--text-muted)',
  padding: '1px 6px',
  borderRadius: '4px',
};

const customBadgeStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 600,
  backgroundColor: 'var(--color-primary-light)',
  color: 'var(--color-primary)',
  padding: '1px 5px',
  borderRadius: '3px',
};

const deleteIconButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--status-danger)',
  cursor: 'pointer',
  padding: '4px',
};

const emptyCardStyle: React.CSSProperties = {
  padding: '30px',
  textAlign: 'center',
  backgroundColor: 'var(--bg-card)',
  border: '1px dashed var(--border-color)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--text-muted)',
  fontSize: '14px',
};

// Modal styles
const modalBackdropStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
  backdropFilter: 'blur(3px)',
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-lg)',
  padding: '24px',
  width: '100%',
  maxWidth: '480px',
  boxShadow: 'var(--shadow-lg)',
};

const modalHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const iconCloseButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-muted)',
  cursor: 'pointer',
};

const formLabelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  marginBottom: '6px',
};

const formInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  fontSize: '13px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-input)',
  color: 'var(--text-primary)',
};

const cancelButtonStyle: React.CSSProperties = {
  padding: '8px 14px',
  backgroundColor: 'var(--bg-card-muted)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  color: 'var(--text-secondary)',
};

const submitButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  backgroundColor: 'var(--color-primary)',
  color: '#ffffff',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
};
