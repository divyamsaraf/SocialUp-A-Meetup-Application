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
import CategoryRow from '../components/common/CategoryRow';
import GroupsFiltersRow from '../components/common/GroupsFiltersRow';
import { colors } from '../theme';
import { typography } from '../theme';
import { spacing } from '../theme';
import { borderRadius } from '../theme';
import { shadows } from '../theme';

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
    // Update search query from GlobalSearchBar
    setSearchQuery(data.query || '');
    
    // Update URL params
    setPage(1);
    const params = new URLSearchParams();
    if (data.query) params.set('q', data.query);
    // Keep existing filter params
    if (filters.category) params.set('category', filters.category);
    if (filters.privacy) params.set('privacy', filters.privacy);
    if (filters.sortBy && filters.sortBy !== 'popularity') params.set('sortBy', filters.sortBy);
    setSearchParams(params);
  };

  // Handle filter change (for direct filter updates)
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setPage(1);
    
    // Update URL params
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.privacy) params.set('privacy', newFilters.privacy);
    if (newFilters.sortBy && newFilters.sortBy !== 'popularity') params.set('sortBy', newFilters.sortBy);
    setSearchParams(params);
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
    // Announce reset to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    announcement.textContent = 'All filters have been reset';
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);

    setFilters({
      category: '',
      privacy: '',
      sortBy: 'popularity',
    });
    setSearchQuery('');
    setPage(1);
    setSearchParams({});
  };

  const hasActiveFilters = filters.category || filters.privacy || 
    filters.sortBy !== 'popularity' || searchQuery.trim();

  if (loading && groups.length === 0) {
    return (
      <div 
        className="min-h-screen"
        style={{ backgroundColor: colors.background.secondary }}
      >
        <LayoutContainer>
          <Loading />
        </LayoutContainer>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <LayoutContainer>
        {/* Header */}
        <div 
          style={{
            paddingTop: spacing[6],
            paddingBottom: spacing[4],
          }}
        >
          <h1 
            style={{
              fontSize: typography.fontSize['3xl'],
              fontWeight: typography.fontWeight.extrabold,
              color: colors.text.primary,
              marginBottom: spacing[2],
            }}
          >
            Groups for your interests
          </h1>
          <p 
            style={{
              color: colors.text.secondary,
              fontSize: typography.fontSize.base,
            }}
          >
            Find communities to learn, build, and meet people who care about what you do.
          </p>
        </div>

        {/* Global Search Bar */}
        <div style={{ marginBottom: spacing[4] }}>
          <GlobalSearchBar
            searchScope="groups"
            placeholder="Search groups..."
            onSearch={handleGlobalSearch}
          />
        </div>

        {/* Groups Filters Row - All filters in a single horizontal row */}
        {/* Note: Category filter removed - categories handled by CategoryRow below */}
        <GroupsFiltersRow
          selectedFilters={{
            privacy: filters.privacy || '',
            sortBy: filters.sortBy || 'popularity',
          }}
          onFilterChange={handleFilterChange}
          onReset={clearFilters}
        />

        {/* Category Row - Dynamic, scrollable categories with arrows */}
        <CategoryRow
          categories={categories.map(cat => ({
            id: cat.isSpecial && cat.specialType === 'all_groups' ? 'all_groups' : cat.name,
            name: cat.name,
            label: cat.name,
            icon: cat.icon,
            isSpecial: cat.isSpecial,
            specialType: cat.specialType,
          }))}
          selectedCategoryId={
            filters.category 
              ? filters.category 
              : (categories.find(cat => cat.isSpecial && cat.specialType === 'all_groups') ? 'all_groups' : '')
          }
          onCategorySelect={handleCategoryClick}
          ariaLabel="Group category filters"
          showArrowsOnMobile={false}
        />

        {/* Groups Grid */}
        <div>
          <div 
            className="flex items-center justify-between"
            style={{ marginBottom: spacing[4] }}
          >
            <h2 
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
              }}
            >
              {searchQuery ? `Search results` : 'Groups'}
            </h2>
            {pagination && (
              <p 
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.text.secondary,
                }}
              >
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
              <div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                style={{
                  gap: spacing[4],
                  marginBottom: spacing[6],
                }}
              >
                {groups.filter(group => group && group._id).map((group) => (
                  <GroupCard key={group._id} group={group} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div 
                  className="flex justify-center items-center"
                  style={{ gap: spacing[2] }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    aria-label="Previous page"
                  >
                    Previous
                  </Button>
                  <span 
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.secondary,
                      paddingLeft: spacing[4],
                      paddingRight: spacing[4],
                    }}
                  >
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
