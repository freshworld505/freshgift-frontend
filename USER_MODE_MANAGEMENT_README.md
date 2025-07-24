# User Mode Management Implementation

## Overview

This implementation ensures that users are automatically switched to "user" mode when accessing any page in the application, except for the deals page which remains in "business" mode.

## Files Created/Modified

### 1. New Hook: `use-user-mode.ts`

**Location**: `/src/hooks/use-user-mode.ts`

**Features**:

- Monitors the current page route and user authentication status
- Automatically checks user mode when navigating to different pages
- Switches users to "user" mode if they're in "business" mode (except on excluded pages)
- Excludes deals page (`/deals`), admin routes (`/admin/*`), and delivery routes (`/delivery/*`)
- Includes race condition protection to prevent multiple simultaneous API calls
- Handles errors gracefully without disrupting user experience

### 2. New Component: `UserModeManager.tsx`

**Location**: `/src/components/layout/UserModeManager.tsx`

**Features**:

- Wrapper component that utilizes the `useUserMode` hook
- Renders nothing (null component) but manages mode logic
- Designed to be included at the app level for global mode management

### 3. Updated Providers Component

**Location**: `/src/components/Providers.tsx`

**Changes**:

- Added import for `UserModeManager`
- Included `UserModeManager` component in the provider tree
- Positioned after `AuthProvider` to ensure authentication state is available

## API Integration

The implementation uses the existing API functions:

- `getCurrentUserMode()` - Fetches current user mode from backend
- `switchUserRole()` - Switches user mode between "user" and "business"

## Page-Specific Behavior

### User Mode (Default)

All pages except those explicitly excluded will ensure users are in "user" mode:

- Homepage (`/`)
- Products (`/products/*`)
- Categories (`/categories/*`)
- Cart (`/cart`)
- Checkout (`/checkout`)
- Account pages (`/account/*`)
- Search (`/search`)
- Login/Signup (`/login`, `/signup`)
- Static pages (`/about`, `/contact`, `/help`, etc.)

### Business Mode (Maintained)

These pages maintain their existing behavior:

- **Deals page (`/deals`)** - The existing logic switches users TO business mode
- **Admin routes (`/admin/*`)** - No mode switching for admin functionality
- **Delivery routes (`/delivery/*`)** - No mode switching for delivery functionality

## Technical Implementation

### State Management

- Uses `useAuthStore` to check authentication status
- Uses `usePathname` to monitor route changes
- Includes `useRef` for race condition protection

### Error Handling

- Graceful fallback if API calls fail
- Silent error handling to avoid disrupting user experience
- Console logging for debugging purposes

### Performance Considerations

- Only runs when user is authenticated
- Excludes irrelevant routes to minimize API calls
- Prevents duplicate API calls with processing flag
- Uses useEffect with proper dependencies

## How It Works

1. **User navigates to any page** → `UserModeManager` detects route change
2. **Check if authenticated** → Skip if not authenticated
3. **Check if excluded route** → Skip if deals, admin, or delivery page
4. **Fetch current mode** → Call `getCurrentUserMode()` API
5. **Switch if needed** → If in business mode, call `switchUserRole()` API
6. **Continue normally** → User sees page content in correct mode

## Integration Points

The system integrates seamlessly with existing code:

- **BusinessRoleToggle component** - Still works normally for manual switching
- **Deals page logic** - Continues to force business mode as intended
- **Admin functionality** - Unaffected by user mode management
- **Authentication flow** - Works with existing auth state management

## Benefits

1. **Automatic Mode Management** - Users don't need to manually switch modes
2. **Consistent User Experience** - Most pages always show user-mode pricing/features
3. **Business Deals Preserved** - Deals page still switches to business mode
4. **Non-Intrusive** - Silent switching without disrupting user flow
5. **Error Resilient** - Fails gracefully if APIs are unavailable

## Testing

To test the implementation:

1. Login as a business user
2. Navigate to deals page (should be in business mode)
3. Navigate to any other page (should automatically switch to user mode)
4. Use BusinessRoleToggle to manually switch modes (should still work)
5. Return to deals page (should switch back to business mode)

## Future Enhancements

- Add optional toast notifications for mode switches (currently commented out)
- Add user preferences to control automatic mode switching
- Add analytics tracking for mode switching patterns
- Consider page-specific mode requirements configuration
