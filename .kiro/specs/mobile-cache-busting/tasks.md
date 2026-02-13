# Implementation Plan: Mobile Cache Busting and Version Management

## Overview

This implementation plan breaks down the cache busting and version management system into discrete, incremental steps. Each task builds on previous work, with testing integrated throughout to catch issues early. The approach leverages Vite's built-in capabilities and adds custom version tracking with minimal complexity.

## Tasks

- [ ] 1. Configure Vite for content-based cache busting
  - Update vite.config.ts to enable content hashing for all assets
  - Configure output filename patterns with hash placeholders
  - Set appropriate cache headers for hashed assets
  - Verify existing code splitting and lazy loading configurations are preserved
  - _Requirements: 1.1, 1.2, 1.5, 5.2, 5.3, 6.4, 6.5_

- [ ]* 1.1 Write property test for static asset hashing
  - **Property 1: Static Asset Hashing**
  - **Validates: Requirements 1.1, 1.2, 7.1, 7.5**

- [ ]* 1.2 Write property test for hash sensitivity
  - **Property 2: Hash Sensitivity to Content Changes**
  - **Validates: Requirements 1.3, 7.2**

- [ ]* 1.3 Write property test for hash stability
  - **Property 3: Hash Stability for Unchanged Content**
  - **Validates: Requirements 1.4**

- [ ]* 1.4 Write property test for reference integrity
  - **Property 4: Reference Integrity in HTML**
  - **Validates: Requirements 1.5**

- [ ] 2. Create Vite version plugin
  - [ ] 2.1 Implement version plugin with build hooks
    - Create vite-version-plugin.ts in project root
    - Implement buildStart hook to generate version info
    - Generate timestamp-based version string (YYYY.MM.DD.HHmm format)
    - Execute git commands to get commit hash and branch (with error handling)
    - Write version.json to output directory
    - Handle development vs production environment detection
    - _Requirements: 2.1, 2.2, 2.3, 8.1, 8.2_

  - [ ]* 2.2 Write property test for version uniqueness
    - **Property 5: Version Uniqueness by Timestamp**
    - **Validates: Requirements 2.1, 6.2, 8.2**

  - [ ]* 2.3 Write property test for git information inclusion
    - **Property 6: Git Information Inclusion**
    - **Validates: Requirements 2.2**

  - [ ]* 2.4 Write property test for version JSON validity
    - **Property 7: Version JSON Validity**
    - **Validates: Requirements 2.3**

  - [ ]* 2.5 Write unit tests for plugin error handling
    - Test git command failures (graceful degradation)
    - Test file write failures (build fails with clear error)
    - Test invalid configuration (validation errors)
    - _Requirements: 8.5_

- [ ] 3. Integrate version plugin into Vite config
  - Add version plugin to vite.config.ts plugins array
  - Configure plugin options (output file path, git info inclusion)
  - Test build process generates version.json correctly
  - Verify version.json is included in build output
  - _Requirements: 2.1, 2.2, 2.3, 5.5_

- [ ]* 3.1 Write property test for configuration error messages
  - **Property 15: Configuration Error Messages**
  - **Validates: Requirements 8.5**

- [ ] 4. Checkpoint - Verify build system changes
  - Ensure all tests pass
  - Run production build and verify hashed assets are generated
  - Verify version.json exists in dist folder with correct structure
  - Check that existing code splitting still works
  - Ask the user if questions arise

- [ ] 5. Create version manager hook
  - [ ] 5.1 Implement useVersion hook
    - Create src/hooks/useVersion.ts
    - Implement fetch logic for version.json
    - Add loading and error state management
    - Implement caching to prevent duplicate fetches
    - Add retry logic for failed fetches (max 3 retries, 5s delay)
    - Return mock data in development mode
    - _Requirements: 2.4, 2.5_

  - [ ]* 5.2 Write property test for version hook API contract
    - **Property 8: Version Hook API Contract**
    - **Validates: Requirements 2.4**

  - [ ]* 5.3 Write unit tests for version hook
    - Test successful version fetch
    - Test loading state during fetch
    - Test error state on fetch failure
    - Test retry logic
    - Test development mode mock data
    - Test caching behavior (no duplicate fetches)
    - _Requirements: 2.4_

  - [ ]* 5.4 Write example test for console logging
    - Test that version is logged to console on startup
    - **Validates: Requirements 2.5**

- [ ] 6. Create cache refresh utility
  - [ ] 6.1 Implement cache refresh function
    - Create src/utils/cacheRefresh.ts
    - Implement Cache API cache clearing
    - Add fallback for browsers without Cache API
    - Implement page reload with cache busting
    - Add optional confirmation dialog
    - Handle errors gracefully with logging
    - _Requirements: 4.2, 4.3, 4.4_

  - [ ]* 6.2 Write unit tests for cache refresh
    - Test cache clear with Cache API available
    - Test fallback when Cache API unavailable
    - Test page reload is triggered
    - Test error handling
    - _Requirements: 4.2, 4.3_

- [ ] 7. Create version badge component
  - [ ] 7.1 Implement VersionBadge component
    - Create src/components/VersionBadge.tsx
    - Use useVersion hook to get version data
    - Render version string or "DEV" based on environment
    - Add loading spinner for loading state
    - Handle error state gracefully
    - Implement click handler to trigger cache refresh
    - Add toast notification on cache refresh
    - Style component to be subtle and unobtrusive
    - Position in bottom-right corner by default
    - Make responsive for mobile and desktop
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 3.6, 4.1, 4.4_

  - [ ]* 7.2 Write property test for version display rendering
    - **Property 9: Version Display Rendering**
    - **Validates: Requirements 3.1, 7.4**

  - [ ]* 7.3 Write property test for development mode display
    - **Property 10: Development Mode Display**
    - **Validates: Requirements 3.5**

  - [ ]* 7.4 Write unit tests for version badge
    - Test rendering with valid version data
    - Test rendering in loading state
    - Test rendering in error state
    - Test responsive styling on mobile/desktop
    - _Requirements: 3.1, 3.2, 3.3, 3.5_

  - [ ]* 7.5 Write example tests for click interactions
    - Test click handler triggers cache refresh
    - Test confirmation message display
    - **Validates: Requirements 4.1, 4.4**

- [ ] 8. Integrate version badge into application
  - Add VersionBadge component to App.tsx
  - Position badge in bottom-right corner
  - Ensure badge appears on all pages (desktop and mobile)
  - Test badge visibility on mobile pages (width < 768px)
  - Test badge doesn't obstruct mobile bottom navigation
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 7.4_

- [ ] 9. Add mobile-specific styling for version badge
  - Create mobile-specific CSS rules in mobile-app.css
  - Ensure badge is visible but doesn't interfere with mobile UI
  - Adjust z-index to appear above content but below modals
  - Test on various mobile viewport sizes
  - _Requirements: 3.2, 3.4, 7.4_

- [ ] 10. Checkpoint - Verify runtime functionality
  - Ensure all tests pass
  - Run application in development mode and verify "DEV" badge appears
  - Build for production and verify version badge shows correct version
  - Test click to refresh cache functionality
  - Verify version is logged to console on startup
  - Ask the user if questions arise

- [ ]* 11. Write property tests for backward compatibility
  - [ ]* 11.1 Write property test for code splitting preservation
    - **Property 11: Code Splitting Preservation**
    - **Validates: Requirements 5.2**

  - [ ]* 11.2 Write property test for lazy loading preservation
    - **Property 12: Lazy Loading Preservation**
    - **Validates: Requirements 5.3**

  - [ ]* 11.3 Write property test for import statement compatibility
    - **Property 14: Import Statement Compatibility**
    - **Validates: Requirements 8.3**

- [ ]* 12. Write property test for cache header configuration
  - **Property 13: Cache Header Configuration**
  - **Validates: Requirements 6.4, 6.5**

- [ ] 13. Final integration and deployment verification
  - Build application for production
  - Deploy to Vercel
  - Verify new version appears immediately after deployment
  - Test mobile-app.css is served with new hash
  - Verify cache headers are set correctly
  - Test force refresh functionality on deployed site
  - Confirm version badge displays correct build information
  - _Requirements: 6.1, 6.2, 6.3, 7.1, 7.2, 7.3_

- [ ] 14. Final checkpoint - Complete system verification
  - Ensure all tests pass (unit and property tests)
  - Verify build process is fully automated
  - Confirm no manual intervention needed for deployments
  - Test that existing imports still work without modification
  - Verify mobile design updates are immediately visible
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each property test should run minimum 100 iterations with randomized inputs
- Property tests should be tagged with: **Feature: mobile-cache-busting, Property {N}: {description}**
- The version plugin should gracefully handle git unavailability (not fail the build)
- Cache refresh should work even if Cache API is not available (fallback to simple reload)
- Version badge should be subtle and not interfere with existing UI
- All changes should preserve existing functionality (code splitting, lazy loading, imports)
