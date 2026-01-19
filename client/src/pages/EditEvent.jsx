import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { eventService } from '../services/event.service';
import { EVENT_CATEGORIES, EVENT_LOCATION_TYPES } from '../utils/constants';
import ErrorMessage from '../components/common/ErrorMessage';
import Loading from '../components/common/Loading';
import PrivateRoute from '../components/common/PrivateRoute';
import LayoutContainer from '../components/common/LayoutContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { colors } from '../theme';
import { typography } from '../theme';
import { spacing } from '../theme';
import { borderRadius } from '../theme';
import { shadows } from '../theme';
import { inputs } from '../theme';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const eventLocationType = watch('eventLocationType');
  const isInPerson = eventLocationType === EVENT_LOCATION_TYPES.IN_PERSON;

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await eventService.getEventById(id);
      const eventData = response.data.event;
      setEvent(eventData);

      const dateTime = new Date(eventData.dateAndTime);
      const localDateTime = new Date(dateTime.getTime() - dateTime.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

      setValue('title', eventData.title);
      setValue('description', eventData.description);
      setValue('dateAndTime', localDateTime);
      setValue('eventCategory', eventData.eventCategory);
      setValue('eventLocationType', eventData.eventLocationType);
      setValue('maxAttendees', eventData.maxAttendees || '');
      if (eventData.location) {
        setValue('address', eventData.location.address || '');
        setValue('city', eventData.location.city || '');
        setValue('state', eventData.location.state || '');
        setValue('zipCode', eventData.location.zipCode || '');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setError('');
    setSubmitting(true);

    try {
      const eventData = {
        title: data.title,
        description: data.description,
        dateAndTime: new Date(data.dateAndTime).toISOString(),
        eventCategory: data.eventCategory,
        eventLocationType: data.eventLocationType,
        ...(data.maxAttendees && { maxAttendees: parseInt(data.maxAttendees) }),
        ...(isInPerson && {
          location: {
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            zipCode: data.zipCode || '',
          },
        }),
      };

      await eventService.updateEvent(id, eventData);
      navigate(`/events/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update event');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!event) {
    return (
      <div 
        style={{
          padding: spacing[8],
          color: colors.text.primary,
        }}
      >
        Event not found
      </div>
    );
  }

  return (
    <PrivateRoute>
      <div 
        className="min-h-screen"
        style={{ backgroundColor: colors.background.secondary }}
      >
        <LayoutContainer>
          <div 
            style={{
              paddingTop: spacing[8],
              paddingBottom: spacing[8],
            }}
          >
            <h1 
              style={{
                fontSize: typography.fontSize['3xl'],
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
                marginBottom: spacing[6],
              }}
            >
              Edit Event
            </h1>

            <Card style={{ padding: spacing[6] }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                {error && <ErrorMessage message={error} />}

                <div className="space-y-4">
                  <div>
                    <label 
                      className="block mb-1"
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.text.secondary,
                      }}
                    >
                      Event Title <span style={{ color: colors.error[500] }}>*</span>
                    </label>
                    <input
                      {...register('title', {
                        required: 'Title is required',
                        maxLength: { value: 200, message: 'Title must be less than 200 characters' },
                      })}
                      type="text"
                      className="w-full focus:outline-none focus:ring-2"
                      style={{
                        ...inputs.base,
                        ...inputs.size.md,
                        ...inputs.state.default,
                        borderRadius: borderRadius.md,
                      }}
                      onFocus={(e) => {
                        e.target.style.border = `2px solid ${colors.border.focus}`;
                        e.target.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
                      }}
                      onBlur={(e) => {
                        e.target.style.border = `1px solid ${colors.border.default}`;
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    {errors.title && (
                      <p 
                        className="mt-1"
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.error[600],
                        }}
                      >
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label 
                      className="block mb-1"
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.text.secondary,
                      }}
                    >
                      Description <span style={{ color: colors.error[500] }}>*</span>
                    </label>
                    <textarea
                      {...register('description', {
                        required: 'Description is required',
                        maxLength: { value: 5000, message: 'Description must be less than 5000 characters' },
                      })}
                      rows="6"
                      className="w-full focus:outline-none focus:ring-2 resize-none"
                      style={{
                        ...inputs.base,
                        ...inputs.size.md,
                        ...inputs.state.default,
                        borderRadius: borderRadius.md,
                      }}
                      onFocus={(e) => {
                        e.target.style.border = `2px solid ${colors.border.focus}`;
                        e.target.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
                      }}
                      onBlur={(e) => {
                        e.target.style.border = `1px solid ${colors.border.default}`;
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    {errors.description && (
                      <p 
                        className="mt-1"
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.error[600],
                        }}
                      >
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label 
                      className="block mb-1"
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.text.secondary,
                      }}
                    >
                      Date & Time <span style={{ color: colors.error[500] }}>*</span>
                    </label>
                    <input
                      {...register('dateAndTime', { required: 'Date and time is required' })}
                      type="datetime-local"
                      className="w-full focus:outline-none focus:ring-2"
                      style={{
                        ...inputs.base,
                        ...inputs.size.md,
                        ...inputs.state.default,
                        borderRadius: borderRadius.md,
                      }}
                      onFocus={(e) => {
                        e.target.style.border = `2px solid ${colors.border.focus}`;
                        e.target.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
                      }}
                      onBlur={(e) => {
                        e.target.style.border = `1px solid ${colors.border.default}`;
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    {errors.dateAndTime && (
                      <p 
                        className="mt-1"
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.error[600],
                        }}
                      >
                        {errors.dateAndTime.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label 
                      className="block mb-1"
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.text.secondary,
                      }}
                    >
                      Category <span style={{ color: colors.error[500] }}>*</span>
                    </label>
                    <select
                      {...register('eventCategory', { required: 'Category is required' })}
                      className="w-full focus:outline-none focus:ring-2 bg-white"
                      style={{
                        ...inputs.base,
                        ...inputs.size.md,
                        ...inputs.state.default,
                        borderRadius: borderRadius.md,
                      }}
                      onFocus={(e) => {
                        e.target.style.border = `2px solid ${colors.border.focus}`;
                        e.target.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
                      }}
                      onBlur={(e) => {
                        e.target.style.border = `1px solid ${colors.border.default}`;
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <option value="">Select a category</option>
                      {EVENT_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.eventCategory && (
                      <p 
                        className="mt-1"
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.error[600],
                        }}
                      >
                        {errors.eventCategory.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label 
                      className="block mb-1"
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.text.secondary,
                      }}
                    >
                      Location Type <span style={{ color: colors.error[500] }}>*</span>
                    </label>
                    <select
                      {...register('eventLocationType', { required: 'Location type is required' })}
                      className="w-full focus:outline-none focus:ring-2 bg-white"
                      style={{
                        ...inputs.base,
                        ...inputs.size.md,
                        ...inputs.state.default,
                        borderRadius: borderRadius.md,
                      }}
                      onFocus={(e) => {
                        e.target.style.border = `2px solid ${colors.border.focus}`;
                        e.target.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
                      }}
                      onBlur={(e) => {
                        e.target.style.border = `1px solid ${colors.border.default}`;
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <option value="">Select location type</option>
                      <option value={EVENT_LOCATION_TYPES.ONLINE}>Online</option>
                      <option value={EVENT_LOCATION_TYPES.IN_PERSON}>In Person</option>
                    </select>
                    {errors.eventLocationType && (
                      <p 
                        className="mt-1"
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.error[600],
                        }}
                      >
                        {errors.eventLocationType.message}
                      </p>
                    )}
                  </div>

                  {isInPerson && (
                    <>
                      <div>
                        <label 
                          className="block mb-1"
                          style={{
                            fontSize: typography.fontSize.sm,
                            fontWeight: typography.fontWeight.medium,
                            color: colors.text.secondary,
                          }}
                        >
                          Address
                        </label>
                        <input
                          {...register('address')}
                          type="text"
                          className="w-full focus:outline-none focus:ring-2"
                          style={{
                            ...inputs.base,
                            ...inputs.size.md,
                            ...inputs.state.default,
                            borderRadius: borderRadius.md,
                          }}
                          onFocus={(e) => {
                            e.target.style.border = `2px solid ${colors.border.focus}`;
                            e.target.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
                          }}
                          onBlur={(e) => {
                            e.target.style.border = `1px solid ${colors.border.default}`;
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>

                      <div className="grid grid-cols-2" style={{ gap: spacing[4] }}>
                        <div>
                          <label 
                            className="block mb-1"
                            style={{
                              fontSize: typography.fontSize.sm,
                              fontWeight: typography.fontWeight.medium,
                              color: colors.text.secondary,
                            }}
                          >
                            City
                          </label>
                          <input
                            {...register('city')}
                            type="text"
                            className="w-full focus:outline-none focus:ring-2"
                            style={{
                              ...inputs.base,
                              ...inputs.size.md,
                              ...inputs.state.default,
                              borderRadius: borderRadius.md,
                            }}
                            onFocus={(e) => {
                              e.target.style.border = `2px solid ${colors.border.focus}`;
                              e.target.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
                            }}
                            onBlur={(e) => {
                              e.target.style.border = `1px solid ${colors.border.default}`;
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </div>

                        <div>
                          <label 
                            className="block mb-1"
                            style={{
                              fontSize: typography.fontSize.sm,
                              fontWeight: typography.fontWeight.medium,
                              color: colors.text.secondary,
                            }}
                          >
                            State
                          </label>
                          <input
                            {...register('state')}
                            type="text"
                            className="w-full focus:outline-none focus:ring-2"
                            style={{
                              ...inputs.base,
                              ...inputs.size.md,
                              ...inputs.state.default,
                              borderRadius: borderRadius.md,
                            }}
                            onFocus={(e) => {
                              e.target.style.border = `2px solid ${colors.border.focus}`;
                              e.target.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
                            }}
                            onBlur={(e) => {
                              e.target.style.border = `1px solid ${colors.border.default}`;
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <label 
                          className="block mb-1"
                          style={{
                            fontSize: typography.fontSize.sm,
                            fontWeight: typography.fontWeight.medium,
                            color: colors.text.secondary,
                          }}
                        >
                          ZIP Code
                        </label>
                        <input
                          {...register('zipCode')}
                          type="text"
                          className="w-full focus:outline-none focus:ring-2"
                          style={{
                            ...inputs.base,
                            ...inputs.size.md,
                            ...inputs.state.default,
                            borderRadius: borderRadius.md,
                          }}
                          onFocus={(e) => {
                            e.target.style.border = `2px solid ${colors.border.focus}`;
                            e.target.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
                          }}
                          onBlur={(e) => {
                            e.target.style.border = `1px solid ${colors.border.default}`;
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label 
                      className="block mb-1"
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.text.secondary,
                      }}
                    >
                      Max Attendees (optional)
                    </label>
                    <input
                      {...register('maxAttendees', {
                        min: { value: 1, message: 'Must be at least 1' },
                      })}
                      type="number"
                      min="1"
                      className="w-full focus:outline-none focus:ring-2"
                      style={{
                        ...inputs.base,
                        ...inputs.size.md,
                        ...inputs.state.default,
                        borderRadius: borderRadius.md,
                      }}
                      onFocus={(e) => {
                        e.target.style.border = `2px solid ${colors.border.focus}`;
                        e.target.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
                      }}
                      onBlur={(e) => {
                        e.target.style.border = `1px solid ${colors.border.default}`;
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    {errors.maxAttendees && (
                      <p 
                        className="mt-1"
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.error[600],
                        }}
                      >
                        {errors.maxAttendees.message}
                      </p>
                    )}
                  </div>
                </div>

                <div 
                  className="flex"
                  style={{
                    marginTop: spacing[6],
                    gap: spacing[4],
                  }}
                >
                  <Button
                    type="submit"
                    disabled={submitting}
                    isLoading={submitting}
                    fullWidth
                    className="flex-1"
                  >
                    Update Event
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/events/${id}`)}
                    fullWidth
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </LayoutContainer>
      </div>
    </PrivateRoute>
  );
};

export default EditEvent;
