import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { eventService } from '../services/event.service';
import { EVENT_CATEGORIES, EVENT_LOCATION_TYPES } from '../utils/constants';
import ErrorMessage from '../components/common/ErrorMessage';
import Loading from '../components/common/Loading';
import PrivateRoute from '../components/common/PrivateRoute';

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
    return <div className="p-8">Event not found</div>;
  }

  return (
    <PrivateRoute>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Event</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-lg p-6">
          {error && <ErrorMessage message={error} />}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Title *
              </label>
              <input
                {...register('title', {
                  required: 'Title is required',
                  maxLength: { value: 200, message: 'Title must be less than 200 characters' },
                })}
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                {...register('description', {
                  required: 'Description is required',
                  maxLength: { value: 5000, message: 'Description must be less than 5000 characters' },
                })}
                rows="6"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date & Time *
              </label>
              <input
                {...register('dateAndTime', { required: 'Date and time is required' })}
                type="datetime-local"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.dateAndTime && (
                <p className="mt-1 text-sm text-red-600">{errors.dateAndTime.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                {...register('eventCategory', { required: 'Category is required' })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a category</option>
                {EVENT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.eventCategory && (
                <p className="mt-1 text-sm text-red-600">{errors.eventCategory.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location Type *
              </label>
              <select
                {...register('eventLocationType', { required: 'Location type is required' })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select location type</option>
                <option value={EVENT_LOCATION_TYPES.ONLINE}>Online</option>
                <option value={EVENT_LOCATION_TYPES.IN_PERSON}>In Person</option>
              </select>
              {errors.eventLocationType && (
                <p className="mt-1 text-sm text-red-600">{errors.eventLocationType.message}</p>
              )}
            </div>

            {isInPerson && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    {...register('address')}
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      {...register('city')}
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      {...register('state')}
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    {...register('zipCode')}
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Attendees (optional)
              </label>
              <input
                {...register('maxAttendees', {
                  min: { value: 1, message: 'Must be at least 1' },
                })}
                type="number"
                min="1"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.maxAttendees && (
                <p className="mt-1 text-sm text-red-600">{errors.maxAttendees.message}</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex space-x-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Update Event'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/events/${id}`)}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </PrivateRoute>
  );
};

export default EditEvent;
