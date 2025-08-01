import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiPlus, FiTarget, FiTrendingUp, FiCalendar, FiDollarSign, FiEdit3, FiTrash2, FiCheck, FiCheckCircle, FiXCircle, FiCopy } from 'react-icons/fi';
import Layout from '../layouts/Layout';
import { useAppContext } from '../context/AppContext';
import useForm from '../hooks/useForm';
import Tooltip from '../components/Tooltip';
import Swal from 'sweetalert2';

const GoalsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2xl);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-xl);
  margin-bottom: var(--space-2xl);
`;

const StatCard = styled.div`
  background-color: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: var(--space-xl);
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
`;

const StatIcon = styled.div`
  width: 50px;
  height: 50px;
  background-color: ${props => props.color || 'var(--accent-primary-light)'};
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${props => props.textColor || 'var(--accent-primary)'};
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
`;

const StatLabel = styled.div`
  color: var(--text-secondary);
  font-size: 0.875rem;
`;

const ActionsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xl);
  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--space-lg);
    align-items: stretch;
  }
`;

const ActionButton = styled.button`
  background-color: var(--accent-primary);
  color: var(--text-inverse);
  border: none;
  border-radius: var(--radius-md);
  padding: var(--space-md) var(--space-xl);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  &:hover {
    background-color: var(--accent-primary-hover);
    transform: translateY(-1px);
  }
`;

const GoalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--space-2xl);
`;

const GoalCard = styled.div`
  background-color: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const GoalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-xl);
`;

const GoalInfo = styled.div`
  flex: 1;
`;

const GoalTitle = styled.h3`
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: var(--space-xs);
`;

const GoalDescription = styled.p`
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: var(--space-sm);
`;

const GoalMeta = styled.div`
  display: flex;
  gap: var(--space-xl);
  margin-bottom: var(--space-lg);
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  color: var(--text-secondary);
  font-size: 0.875rem;
`;

const GoalActions = styled.div`
  display: flex;
  gap: var(--space-sm);
`;

const IconButton = styled.button`
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: var(--space-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  &:hover {
    color: var(--accent-primary);
    border-color: var(--accent-primary);
  }
`;

const ProgressSection = styled.div`
  margin-bottom: var(--space-xl);
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
`;

const ProgressLabel = styled.div`
  color: var(--text-primary);
  font-weight: 600;
`;

const ProgressPercentage = styled.div`
  color: var(--accent-primary);
  font-weight: 600;
  font-size: 0.875rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background-color: var(--bg-tertiary);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: var(--space-sm);
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: var(--accent-primary);
  width: ${props => Math.min(props.percentage, 100)}%;
  transition: all var(--transition-normal);
  position: relative;
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
`;

const CurrentAmount = styled.span`
  color: var(--text-primary);
  font-weight: 600;
`;

const TargetAmount = styled.span`
  color: var(--text-secondary);
`;

const TimeRemaining = styled.div`
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: var(--space-sm) var(--space-md);
  text-align: center;
  margin-top: var(--space-lg);
`;

const TimeLabel = styled.div`
  color: var(--text-secondary);
  font-size: 0.75rem;
  margin-bottom: var(--space-xs);
`;

const TimeValue = styled.div`
  color: var(--text-primary);
  font-weight: 600;
`;

const StatusBadge = styled.div`
  background-color: ${props => {
    switch (props.status) {
      case 'completed': return 'var(--success)';
      case 'in-progress': return 'var(--accent-primary)';
      case 'overdue': return 'var(--danger)';
      default: return 'var(--text-secondary)';
    }
  }};
  color: var(--text-inverse);
  padding: var(--space-xs) var(--space-sm);
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: var(--space-3xl);
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
`;

// Modal styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--overlay-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: var(--space-lg);
`;

const Modal = styled.div`
  background-color: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
  width: 100%;
  max-width: 500px;
  box-shadow: var(--shadow-lg);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xl);
`;

const ModalTitle = styled.h3`
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  &:hover {
    color: var(--text-primary);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;

const Label = styled.label`
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 500;
`;

const Input = styled.input`
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  color: var(--text-primary);
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.1);
  }
  &::placeholder {
    color: var(--text-secondary);
  }
`;

const Textarea = styled.textarea`
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  color: var(--text-primary);
  font-size: 1rem;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.1);
  }
  &::placeholder {
    color: var(--text-secondary);
  }
`;

const ErrorText = styled.div`
  color: var(--danger);
  font-size: 0.75rem;
  margin-top: var(--space-xs);
`;

const FormActions = styled.div`
  display: flex;
  gap: var(--space-lg);
  margin-top: var(--space-xl);
`;

const SubmitButton = styled.button`
  background-color: var(--accent-primary);
  color: var(--text-inverse);
  border: none;
  border-radius: var(--radius-md);
  padding: var(--space-md) var(--space-xl);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  flex: 1;
  &:hover {
    background-color: var(--accent-primary-hover);
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const CancelButton = styled.button`
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: var(--space-md) var(--space-xl);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  &:hover {
    border-color: var(--accent-primary);
    color: var(--accent-primary);
  }
`;

/**
 * Goals Component - updated with new theme
 */
const Goals = () => {
  const { state, actions } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'n' || e.key === 'N') {
        setShowModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Form validation rules
  const validationRules = {
    title: {
      required: { message: 'Goal title is required' },
      minLength: { value: 3, message: 'Title must be at least 3 characters' }
    },
    description: {
      maxLength: { value: 200, message: 'Description cannot exceed 200 characters' }
    },
    targetAmount: {
      required: { message: 'Target amount is required' },
      number: { message: 'Please enter a valid number' },
      positive: { message: 'Amount must be greater than 0' }
    },
    currentAmount: {
      number: { message: 'Please enter a valid number' },
      custom: (value, values) => {
        if (parseFloat(value) < 0) return 'Current amount cannot be negative';
        if (parseFloat(value) > parseFloat(values.targetAmount)) {
          return 'Current amount cannot exceed target amount';
        }
        return null;
      }
    },
    targetDate: {
      required: { message: 'Target date is required' },
      custom: (value) => {
        const today = new Date();
        const target = new Date(value);
        if (target <= today) return 'Target date must be in the future';
        return null;
      }
    }
  };

  // Form hook
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  } = useForm(
    {
      title: '',
      description: '',
      targetAmount: '',
      currentAmount: '0',
      targetDate: ''
    },
    validationRules
  );

  // Mock goals for demonstration
  const mockGoals = [
    {
      id: '1',
      title: 'Emergency Fund',
      description: 'Build a 6-month emergency fund for financial security',
      targetAmount: 15000,
      currentAmount: 8500,
      targetDate: '2024-12-31',
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      title: 'Vacation to Japan',
      description: 'Save for a 2-week trip to Japan including flights and accommodation',
      targetAmount: 5000,
      currentAmount: 2100,
      targetDate: '2024-09-01',
      createdAt: '2024-01-01'
    },
    {
      id: '3',
      title: 'New Laptop',
      description: 'MacBook Pro for work and personal projects',
      targetAmount: 2500,
      currentAmount: 2500,
      targetDate: '2024-03-15',
      createdAt: '2024-01-01'
    }
  ];

  // Use real goals if available, otherwise use mock data
  const goals = state.goals.length > 0 ? state.goals : mockGoals;

  // Calculate statistics
  const totalGoals = goals.length;
  const completedGoals = goals.filter(goal => goal.currentAmount >= goal.targetAmount).length;
  const totalSavedAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const averageProgress = goals.length > 0 
    ? goals.reduce((sum, goal) => sum + (goal.currentAmount / goal.targetAmount * 100), 0) / goals.length 
    : 0;

  // Helper functions
  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const calculateDaysRemaining = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getGoalStatus = (goal) => {
    if (goal.currentAmount >= goal.targetAmount) return 'completed';
    const daysRemaining = calculateDaysRemaining(goal.targetDate);
    if (daysRemaining < 0) return 'overdue';
    return 'in-progress';
  };

  const formatTimeRemaining = (targetDate) => {
    const daysRemaining = calculateDaysRemaining(targetDate);
    
    if (daysRemaining < 0) {
      return `${Math.abs(daysRemaining)} days overdue`;
    } else if (daysRemaining === 0) {
      return 'Due today';
    } else if (daysRemaining < 30) {
      return `${daysRemaining} days left`;
    } else if (daysRemaining < 365) {
      const months = Math.floor(daysRemaining / 30);
      const days = daysRemaining % 30;
      return `${months}m ${days}d left`;
    } else {
      const years = Math.floor(daysRemaining / 365);
      const months = Math.floor((daysRemaining % 365) / 30);
      return `${years}y ${months}m left`;
    }
  };

  // Handle form submission
  const onSubmit = async (formData) => {
    try {
      const goalData = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount)
      };

      if (editingGoal) {
        actions.updateGoal({ ...editingGoal, ...goalData });
        actions.addNotification('Goal updated successfully!', 'success');
      } else {
        actions.addGoal(goalData);
        actions.addNotification('Goal created successfully!', 'success');
      }
      
      setShowModal(false);
      setEditingGoal(null);
      reset();
    } catch (error) {
      console.error('Goal operation error:', error);
      actions.addNotification('Failed to save goal. Please try again.', 'error');
    }
  };

  // Handle edit goal
  const handleEdit = (goal) => {
    setEditingGoal(goal);
    handleChange('title', goal.title);
    handleChange('description', goal.description || '');
    handleChange('targetAmount', goal.targetAmount.toString());
    handleChange('currentAmount', goal.currentAmount.toString());
    handleChange('targetDate', goal.targetDate);
    setShowModal(true);
  };

  // Handle delete goal
  const handleDelete = (goalId) => {
    Swal.fire({
      title: 'Delete Goal?',
      text: 'Are you sure you want to delete this goal? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      background: 'var(--bg-card)',
      color: 'var(--text-primary)',
    }).then((result) => {
      if (result.isConfirmed) {
        actions.deleteGoal(goalId);
        actions.addNotification('Goal deleted successfully!', 'success');
      }
    });
  };

  // Handle mark as complete
  const handleMarkComplete = (goal) => {
    actions.updateGoal({
      ...goal,
      currentAmount: goal.targetAmount
    });
    actions.addNotification('Congratulations! Goal completed!', 'success');
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingGoal(null);
    reset();
  };

  // Copy to clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    actions.addNotification('Copied to clipboard!', 'success');
  };

  return (
    <Layout title="Financial Goals">
      <GoalsContainer>
        {/* Statistics */}
        <StatsGrid>
          <StatCard>
            <StatIcon color="var(--accent-primary-light)" textColor="var(--accent-primary)">
              <FiTarget />
            </StatIcon>
            <StatInfo>
              <StatValue>{totalGoals}</StatValue>
              <StatLabel>Total Goals</StatLabel>
            </StatInfo>
          </StatCard>

          <StatCard>
            <StatIcon color="var(--success-light)" textColor="var(--success)">
              <FiCheck />
            </StatIcon>
            <StatInfo>
              <StatValue>{completedGoals}</StatValue>
              <StatLabel>Completed Goals</StatLabel>
            </StatInfo>
          </StatCard>

          <StatCard>
            <StatIcon color="var(--warning-light)" textColor="var(--warning)">
              <FiDollarSign />
            </StatIcon>
            <StatInfo>
              <StatValue>${totalSavedAmount.toFixed(0)}</StatValue>
              <StatLabel>Total Saved</StatLabel>
            </StatInfo>
          </StatCard>

          <StatCard>
            <StatIcon color="#8b5cf6" textColor="var(--text-inverse)">
              <FiTrendingUp />
            </StatIcon>
            <StatInfo>
              <StatValue>{averageProgress.toFixed(1)}%</StatValue>
              <StatLabel>Average Progress</StatLabel>
            </StatInfo>
          </StatCard>
        </StatsGrid>

        {/* Actions Bar */}
        <ActionsBar>
          <h2 style={{ color: 'var(--text-primary)', margin: 0 }}>Your Goals</h2>
          <div className="desktop-action-btn-row">
            <Tooltip content="Add new goal (Shortcut: N)" position="bottom">
              <ActionButton onClick={() => setShowModal(true)} aria-label="Add new goal">
                <FiPlus /> Add Goal
              </ActionButton>
            </Tooltip>
          </div>
        </ActionsBar>
        {/* Sticky Add Goal Button for Mobile */}
        <div className="sticky-action-btn">
          <ActionButton onClick={() => setShowModal(true)} aria-label="Add new goal">
            <FiPlus /> Add Goal
          </ActionButton>
        </div>

        {/* Goals Grid */}
        <GoalsGrid>
          {goals.map(goal => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            const status = getGoalStatus(goal);
            const timeRemaining = formatTimeRemaining(goal.targetDate);

            return (
              <GoalCard key={goal.id}>
                <GoalHeader>
                  <GoalInfo>
                    <GoalTitle>{goal.title}</GoalTitle>
                    <Tooltip content="Copy title" position="top">
                      <FiCopy style={{ cursor: 'pointer', marginLeft: 6 }} onClick={() => handleCopy(goal.title)} tabIndex={0} aria-label="Copy title" />
                    </Tooltip>
                    <GoalDescription>{goal.description}</GoalDescription>
                    <GoalMeta>
                      <MetaItem>
                        <FiCalendar />
                        <span>{new Date(goal.targetDate).toLocaleDateString()}</span>
                      </MetaItem>
                      <StatusBadge status={status}>
                        {status}
                      </StatusBadge>
                    </GoalMeta>
                  </GoalInfo>
                  <GoalActions>
                    {status !== 'completed' && (
                      <IconButton onClick={() => handleMarkComplete(goal)} title="Mark as complete">
                        <FiCheck />
                      </IconButton>
                    )}
                    <Tooltip content="Edit goal" position="top">
                      <IconButton onClick={() => handleEdit(goal)} aria-label="Edit goal"><FiEdit3 /></IconButton>
                    </Tooltip>
                    <Tooltip content="Delete goal" position="top">
                      <IconButton onClick={() => handleDelete(goal.id)} aria-label="Delete goal"><FiTrash2 /></IconButton>
                    </Tooltip>
                  </GoalActions>
                </GoalHeader>

                <ProgressSection>
                  <ProgressHeader>
                    <ProgressLabel>Progress</ProgressLabel>
                    <ProgressPercentage>{progress.toFixed(1)}%</ProgressPercentage>
                  </ProgressHeader>
                  
                  <ProgressBar>
                    <ProgressFill percentage={progress} />
                  </ProgressBar>
                  
                  <ProgressText>
                    <CurrentAmount>${goal.currentAmount.toFixed(2)}</CurrentAmount>
                    <TargetAmount>of ${goal.targetAmount.toFixed(2)}</TargetAmount>
                  </ProgressText>
                </ProgressSection>

                <TimeRemaining>
                  <TimeLabel>Time Remaining</TimeLabel>
                  <TimeValue>{timeRemaining}</TimeValue>
                </TimeRemaining>
              </GoalCard>
            );
          })}

          {goals.length === 0 && (
            <EmptyState>
              <FiTarget size={48} style={{ opacity: 0.5 }} />
              <div>No goals set yet. Create your first financial goal to get started!</div>
            </EmptyState>
          )}
        </GoalsGrid>

        {/* Modal */}
        {showModal && (
          <ModalOverlay onClick={handleCloseModal}>
            <Modal onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>
                  {editingGoal ? 'Edit Goal' : 'Create New Goal'}
                </ModalTitle>
                <CloseButton onClick={handleCloseModal}>×</CloseButton>
              </ModalHeader>

              <Form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(onSubmit);
              }}>
                <FormGroup>
                  <Label htmlFor="title">Goal Title</Label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Input
                      type="text"
                      id="title"
                      placeholder="e.g., Emergency Fund, Vacation, New Car"
                      value={values.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      onBlur={() => handleBlur('title')}
                      aria-invalid={!!errors.title}
                      aria-describedby="title-error"
                    />
                    {touched.title && !errors.title && <FiCheckCircle color="var(--success)" aria-label="Valid" />}
                    {touched.title && errors.title && <FiXCircle color="var(--danger)" aria-label="Invalid" />}
                  </div>
                  {touched.title && errors.title && (
                    <ErrorText id="title-error">{errors.title}</ErrorText>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your goal and why it's important to you"
                    value={values.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    onBlur={() => handleBlur('description')}
                  />
                  {touched.description && errors.description && (
                    <ErrorText>{errors.description}</ErrorText>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="targetAmount">Target Amount</Label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Input
                      type="number"
                      id="targetAmount"
                      placeholder="How much do you want to save?"
                      value={values.targetAmount}
                      onChange={(e) => handleChange('targetAmount', e.target.value)}
                      onBlur={() => handleBlur('targetAmount')}
                      aria-invalid={!!errors.targetAmount}
                      aria-describedby="targetAmount-error"
                    />
                    {touched.targetAmount && !errors.targetAmount && <FiCheckCircle color="var(--success)" aria-label="Valid" />}
                    {touched.targetAmount && errors.targetAmount && <FiXCircle color="var(--danger)" aria-label="Invalid" />}
                  </div>
                  {touched.targetAmount && errors.targetAmount && (
                    <ErrorText id="targetAmount-error">{errors.targetAmount}</ErrorText>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="currentAmount">Current Amount</Label>
                  <Input
                    type="number"
                    id="currentAmount"
                    placeholder="How much have you saved so far?"
                    value={values.currentAmount}
                    onChange={(e) => handleChange('currentAmount', e.target.value)}
                    onBlur={() => handleBlur('currentAmount')}
                    step="0.01"
                    min="0"
                  />
                  {touched.currentAmount && errors.currentAmount && (
                    <ErrorText>{errors.currentAmount}</ErrorText>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="targetDate">Target Date</Label>
                  <Input
                    type="date"
                    id="targetDate"
                    value={values.targetDate}
                    onChange={(e) => handleChange('targetDate', e.target.value)}
                    onBlur={() => handleBlur('targetDate')}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {touched.targetDate && errors.targetDate && (
                    <ErrorText>{errors.targetDate}</ErrorText>
                  )}
                </FormGroup>

                <FormActions>
                  <CancelButton type="button" onClick={handleCloseModal}>
                    Cancel
                  </CancelButton>
                  <SubmitButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (editingGoal ? 'Update Goal' : 'Create Goal')}
                  </SubmitButton>
                </FormActions>
              </Form>
            </Modal>
          </ModalOverlay>
        )}
      </GoalsContainer>
    </Layout>
  );
};

export default Goals; 