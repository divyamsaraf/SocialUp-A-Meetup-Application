import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { groupService } from '../services/group.service';
import { categoryService } from '../services/category.service';
import GroupCard from '../components/groups/GroupCard';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import LayoutContainer from '../components/common/LayoutContainer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import GlobalSearchBar from '../components/common/GlobalSearchBar';

/**
 * GroupList Page - Modern design matching EventList page structure
 * 
 * Features:
 * - Search bar with submit button
 * - Horizontal filter bar (Category, Privacy, Sort)
 * - Scrollable categories row with pill buttons
 * - Modern group cards
 * - Responsive grid layout
 * - Pagination
 * - Accessibility features
 */
const GroupList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    privacy: searchParams.get('privacy') || '',
    sortBy: searchParams.get('sortBy') || 'popularity',
  });
  
  // Track filter state for GlobalSearchBar (maps to filter names used by GlobalSearchBar)
  const [searchBarFilters, setSearchBarFilters] = useState({
    Category: searchParams.get('category') || '',
    Privacy: searchParams.get('privacy') || '',
    Sort: searchParams.get('sortBy') || 'popularity',
  });

  // Default categories fallback function
  const getDefaultCategories = () => [
    { name: "All groups", icon: "👥", isSpecial: true, specialType: "all_groups" },
    { name: "Technology", icon: "💻" },
    { name: "Social", icon: "🍕" },
    { name: "Sports", icon: "⚽" },
    { name: "Arts", icon: "🎨" },
    { name: "Business", icon: "🏢" },
    { name: "Health", icon: "🧠" },
    { name: "Travel", icon: "🧳" },
    { name: "Food", icon: "🍔" },
    { name: "Music", icon: "🎵" },
    { name: "Education", icon: "📚" },
    { name: "Fitness", icon: "💪" },
  ];

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch groups when filters, search, or page change
  useEffect(() => {
    fetchGroups();
  }, [page, filters, searchQuery]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      const categoriesData = response.data?.categories || response.categories || [];
      if (categoriesData.length > 0) {
        // Map categories to include icons
        const mappedCategories = categoriesData.map((cat, index) => ({
          _id: cat._id || index,
          name: cat.name || cat,
          icon: cat.icon || getDefaultCategories()[index + 1]?.icon || "📌",
          isSpecial: false,
        }));
        // Add "All groups" at the beginning
        setCategories([getDefaultCategories()[0], ...mappedCategories]);
      } else {
        setCategories(getDefaultCategories());
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
      setCategories(getDefaultCategories());
    }
  };

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      // Clean filters - remove empty values
      const cleanFilters = {};
      if (filters.category) cleanFilters.category = filters.category;
      if (filters.privacy) cleanFilters.privacy = filters.privacy;
      if (filters.sortBy) cleanFilters.sortBy = filters.sortBy;
      if (searchQuery?.trim()) cleanFilters.search = searchQuery.trim();
      
      const response = await groupService.getGroups(cleanFilters, page, 12);
      
      // Handle different response structures
      const groupsData = response.data?.groups || response.groups || [];
      const paginationData = response.data?.pagination || response.pagination;
      
      setGroups(Array.isArray(groupsData) ? groupsData : []);
      setPagination(paginationData);
    } catch (err) {
      console.error('Error fetching groups:', err);
      let errorMessage = 'Failed to load groups';
      if (err.response?.status === 404) {
        errorMessage = 'Groups endpoint not found. Please check your API configuration.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setGroups([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [page, filters, searchQuery]);

  // Handle search from GlobalSearchBar
  const handleGlobalSearch = (data) => {
    // Update search query and filters from GlobalSearchBar
    setSearchQuery(data.query || '');
    
    // Update filters from GlobalSearchBar filters
    const newFilters = {
      category: data.filters?.Category || '',
      privacy: data.filters?.Privacy || '',
      sortBy: data.filters?.Sort || 'popularity',
    };
    setFilters(newFilters);
    setSearchBarFilters({
      Category: data.filters?.Category || '',
      Privacy: data.filters?.Privacy || '',
      Sort: data.filters?.Sort || 'popularity',
    });
    
    // Update URL params
    setPage(1);
    const params = new URLSearchParams();
    if (data.query) params.set('q', data.query);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.privacy) params.set('privacy', newFilters.privacy);
    if (newFilters.sortBy !== 'popularity') params.set('sortBy', newFilters.sortBy);
    setSearchParams(params);
  };

  // Handle filter change (for direct filter updates)
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update search bar filters state to keep them in sync
    const filterMap = {
      category: 'Category',
      privacy: 'Privacy',
      sortBy: 'Sort',
    };
    setSearchBarFilters(prev => ({
      ...prev,
      [filterMap[key]]: value,
    }));
    
    setPage(1);
  };

  // Handle category click
  const handleCategoryClick = (category) => {
    if (category.isSpecial) {
      // Handle special categories
      if (category.specialType === 'all_groups') {
        handleFilterChange('category', '');
      }
    } else {
      handleFilterChange('category', category.name);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: '',
      privacy: '',
      sortBy: 'popularity',
    });
    setSearchBarFilters({
      Category: '',
      Privacy: '',
      Sort: 'popularity',
    });
    setSearchQuery('');
    setPage(1);
    setSearchParams({});
  };

  const hasActiveFilters = filters.category || filters.privacy || 
    filters.sortBy !== 'popularity' || searchQuery.trim();

  if (loading && groups.length === 0) {
    return (
      <div className="min-h-screen bg-[#f7f7f7]">
        <LayoutContainer>
          <Loading />
        </LayoutContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <LayoutContainer>
        {/* Header */}
        <div className="pt-6 pb-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            Groups for your interests
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Find communities to learn, build, and meet people who care about what you do.
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="mb-4">
          <GlobalSearchBar
            searchScope="groups"
            filters={[
              {
                name: 'Category',
                options: categories
                  .filter(cat => !cat.isSpecial)
                  .map(cat => ({ value: cat.name, label: cat.name })),
                defaultValue: searchBarFilters.Category,
              },
              {
                name: 'Privacy',
                options: [
                  { value: 'public', label: 'Public' },
                  { value: 'private', label: 'Private' },
                ],
                defaultValue: searchBarFilters.Privacy,
              },
              {
                name: 'Sort',
                options: [
                  { value: 'popularity', label: 'Sort by popularity' },
                  { value: 'members', label: 'Sort by members' },
                  { value: 'newest', label: 'Sort by newest' },
                  { value: 'name', label: 'Sort by name' },
                ],
                defaultValue: searchBarFilters.Sort,
              },
            ]}
            placeholder="Search groups..."
            onSearch={handleGlobalSearch}
          />
        </div>

        {/* Dynamic Categories Row - Scrollable on Mobile */}
        <div className="mb-6">
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-2 min-w-max pb-2">
              {categories.map((category) => {
                const isActive = category.isSpecial
                  ? category.specialType === 'all_groups' && !filters.category
                  : filters.category === category.name;
                
                return (
                  <button
                    key={category._id || category.name}
                    onClick={() => handleCategoryClick(category)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                    aria-pressed={isActive}
                    aria-label={`Filter by ${category.name}`}
                  >
                    <span aria-hidden="true">{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Groups Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {searchQuery ? `Search results` : 'Groups'}
            </h2>
            {pagination && (
              <p className="text-sm text-gray-600">
                {pagination.total || groups.length} {pagination.total === 1 ? 'group' : 'groups'}
              </p>
            )}
          </div>

          {loading ? (
            <Loading />
          ) : error && groups.length === 0 ? (
            <EmptyState
              icon="👥"
              title="Failed to load groups"
              message={error}
            />
          ) : groups.length === 0 ? (
            <EmptyState
              icon="👥"
              title="No groups found"
              message={
                hasActiveFilters
                  ? "Try adjusting your filters or search to find more groups."
                  : "Your interests could be someone else's next friendship."
              }
              actionLabel={hasActiveFilters ? "Clear filters" : "Create a group"}
              onAction={hasActiveFilters ? clearFilters : undefined}
              actionHref={hasActiveFilters ? undefined : "/groups/create"}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                {groups.filter(group => group && group._id).map((group) => (
                  <GroupCard key={group._id} group={group} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    aria-label="Previous page"
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600 px-4">
                    Page {page} of {pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= pagination.pages}
                    aria-label="Next page"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </LayoutContainer>
    </div>
  );
};

export default GroupList;
