import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { groupService } from '../services/group.service';
import { EVENT_CATEGORIES } from '../utils/constants';
import ErrorMessage from '../components/common/ErrorMessage';
import PrivateRoute from '../components/common/PrivateRoute';
import LayoutContainer from '../components/common/LayoutContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const CreateGroup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);

    try {
      const response = await groupService.createGroup(data);
      navigate(`/groups/${response.data.group._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-[#f7f7f7]">
        <LayoutContainer>
          <div className="pt-6 pb-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Group</h1>
              <p className="text-gray-600 text-base">
                Great communities start with shared interests. Create a group to meet people, support each other, and grow together.
              </p>
            </div>

            <Card className="p-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                {error && <ErrorMessage message={error} />}

                <div className="space-y-5">
                  <div>
                    <label htmlFor="group-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Group Name <span className="text-red-500" aria-label="required">*</span>
                    </label>
                    <input
                      {...register('name', {
                        required: 'Group name is required',
                        maxLength: { value: 200, message: 'Name must be less than 200 characters' },
                      })}
                      id="group-name"
                      type="text"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                      placeholder="Enter group name"
                      aria-invalid={errors.name ? 'true' : 'false'}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && (
                      <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="group-description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500" aria-label="required">*</span>
                    </label>
                    <textarea
                      {...register('description', {
                        required: 'Description is required',
                        maxLength: { value: 5000, message: 'Description must be less than 5000 characters' },
                      })}
                      id="group-description"
                      rows="6"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base resize-none"
                      placeholder="Describe your group..."
                      aria-invalid={errors.description ? 'true' : 'false'}
                      aria-describedby={errors.description ? 'description-error' : undefined}
                    />
                    {errors.description && (
                      <p id="description-error" className="mt-1 text-sm text-red-600" role="alert">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="group-category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500" aria-label="required">*</span>
                    </label>
                    <select
                      {...register('category', { required: 'Category is required' })}
                      id="group-category"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white"
                      aria-invalid={errors.category ? 'true' : 'false'}
                      aria-describedby={errors.category ? 'category-error' : undefined}
                    >
                      <option value="">Select a category</option>
                      {EVENT_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p id="category-error" className="mt-1 text-sm text-red-600" role="alert">
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="group-privacy" className="block text-sm font-medium text-gray-700 mb-1">
                      Privacy <span className="text-red-500" aria-label="required">*</span>
                    </label>
                    <select
                      {...register('privacy', { required: 'Privacy setting is required' })}
                      id="group-privacy"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white"
                      aria-invalid={errors.privacy ? 'true' : 'false'}
                      aria-describedby={errors.privacy ? 'privacy-error' : undefined}
                    >
                      <option value="public">Public - Anyone can join</option>
                      <option value="private">Private - Invitation only</option>
                    </select>
                    {errors.privacy && (
                      <p id="privacy-error" className="mt-1 text-sm text-red-600" role="alert">
                        {errors.privacy.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    isLoading={loading}
                    fullWidth
                    className="sm:flex-1 sm:w-auto"
                  >
                    Create Group
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/groups')}
                    fullWidth
                    className="sm:flex-1 sm:w-auto"
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

export default CreateGroup;
