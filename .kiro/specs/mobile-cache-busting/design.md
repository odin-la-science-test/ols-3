# Design Document: Mobile Cache Busting and Version Management

## Overview

This design implements a comprehensive cache busting and version management system for the mobile application. The solution leverages Vite's built-in content hashing capabilities and extends them with custom version tracking and display components.

The system consists of three main components:
1. **Build-time cache busting** using Vite's content hashing
2. **Version generation and management** using build metadata
3. **Runtime version display** with a subtle UI indicator

### Key Design Decisions

- **Use Vite's native features**: Vite already provides excellent cache busting through content hashing. We'll configure it properly rather than building custom solutions.
- **Build-time version generation**: Generate version information during the build process and inject it into the application.
- **Minimal UI footprint**: Version indicator should be visible but unobtrusive, positioned in a corner with small text.
- **No external dependencies**: Use only built-in Vite features and standard browser APIs.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Build Process (Vite)                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │  Version Plugin  │────────▶│  version.json    │          │
│  │  (build time)    │         │  (generated)     │          │
│  └──────────────────┘         └──────────────────┘          │
│           │                            │                     │
│           │                            │                     │
│           ▼                            ▼                     │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │  Content Hashing │────────▶│  Hashed Assets   │          │
│  │  (Vite built-in) │         │  (CSS, JS)       │          │
│  └──────────────────┘         └──────────────────┘          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Deploy
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Runtime (Browser)                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │ Version Manager  │◀────────│  version.json    │          │
│  │  (React Hook)    │         │  (fetch)         │          │
│  └──────────────────┘         └──────────────────┘          │
│           │                                                   │
│           │                                                   │
│           ▼                                                   │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │ Version Badge    │         │  Cache Refresh   │          │
│  │  (UI Component)  │────────▶│  (on click)      │          │
│  └──────────────────┘         └──────────────────┘          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Build Time**:
   - Vite plugin generates version.json with timestamp and git hash
   - Vite's rollup plugin hashes all CSS/JS files based on content
   - HTML references are automatically updated to hashed filenames
   - version.json is copied to the output directory

2. **Runtime**:
   - Application loads and fetches version.json
   - Version information is stored in React context/state
   - Version badge component displays the version
   - User can click badge to force cache refresh

## Components and Interfaces

### 1. Vite Version Plugin

A custom Vite plugin that generates version information during the build process.

**Location**: `vite-version-plugin.ts`

**Interface**:
```typescript
interface VersionInfo {
  version: string;        // Semantic version or timestamp-based
  buildTime: string;      // ISO 8601 timestamp
  gitHash?: string;       // Git commit hash (if available)
  gitBranch?: string;     // Git branch name (if available)
  environment: 'development' | 'production';
}

function versionPlugin(options?: {
  outputFile?: string;    // Default: 'version.json'
  includeGitInfo?: boolean; // Default: true
}): Plugin;
```

**Behavior**:
- Runs during Vite's `buildStart` hook
- Executes git commands to get commit hash and branch
- Generates version string: `YYYY.MM.DD.HHmm` or uses package.json version
- Writes version.json to the output directory
- In development mode, sets environment to 'development'

### 2. Version Manager Hook

A React hook that fetches and manages version information at runtime.

**Location**: `src/hooks/useVersion.ts`

**Interface**:
```typescript
interface VersionData {
  version: string;
  buildTime: string;
  gitHash?: string;
  gitBranch?: string;
  environment: 'development' | 'production';
  isLoading: boolean;
  error?: Error;
}

function useVersion(): VersionData;
```

**Behavior**:
- Fetches `/version.json` on mount
- Caches result in state
- Returns loading state while fetching
- Returns error state if fetch fails
- In development, returns mock data with environment: 'development'

### 3. Version Badge Component

A UI component that displays the current version and provides cache refresh functionality.

**Location**: `src/components/VersionBadge.tsx`

**Interface**:
```typescript
interface VersionBadgeProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

function VersionBadge(props: VersionBadgeProps): JSX.Element;
```

**Behavior**:
- Displays version string in a small badge
- Shows "DEV" in development mode
- Shows loading spinner while version is loading
- On click: clears cache and reloads page
- Shows toast notification after cache clear
- Styled to be subtle but visible
- Responsive: adjusts size on mobile

### 4. Cache Refresh Utility

A utility function that clears browser cache and reloads the page.

**Location**: `src/utils/cacheRefresh.ts`

**Interface**:
```typescript
interface CacheRefreshOptions {
  showConfirmation?: boolean;  // Default: true
  confirmationMessage?: string;
}

async function refreshCache(options?: CacheRefreshOptions): Promise<void>;
```

**Behavior**:
- Clears Service Worker cache if present
- Clears browser cache using Cache API
- Adds cache-busting query parameter to current URL
- Reloads the page with `location.reload(true)`
- Shows confirmation dialog if enabled

## Data Models

### Version Information Model

```typescript
interface VersionInfo {
  // Semantic version or timestamp-based version
  // Format: "YYYY.MM.DD.HHmm" or "1.2.3"
  version: string;
  
  // ISO 8601 timestamp of when the build was created
  // Example: "2024-01-15T14:30:00.000Z"
  buildTime: string;
  
  // Short git commit hash (7 characters)
  // Example: "a1b2c3d"
  gitHash?: string;
  
  // Git branch name
  // Example: "main", "develop", "feature/cache-busting"
  gitBranch?: string;
  
  // Build environment
  environment: 'development' | 'production';
}
```

### Vite Configuration Extension

```typescript
interface ViteBuildConfig {
  build: {
    // Enable content hashing for all assets
    rollupOptions: {
      output: {
        // Hash format: [name].[hash].js
        entryFileNames: 'assets/[name].[hash].js';
        chunkFileNames: 'assets/[name].[hash].js';
        assetFileNames: 'assets/[name].[hash].[ext]';
      }
    }
  }
}
```

## 
Error Handling

### Build-Time Errors

**Git Command Failures**:
- If git commands fail (not a git repo, git not installed), continue build without git info
- Log warning to console but don't fail the build
- Set gitHash and gitBranch to undefined in version.json

**File Write Failures**:
- If version.json cannot be written, fail the build with clear error message
- Error message should include the target path and permission details

**Invalid Configuration**:
- If plugin options are invalid, fail immediately with validation error
- Provide clear message about which option is invalid and expected format

### Runtime Errors

**Version Fetch Failures**:
- If version.json fetch fails (404, network error), show "Unknown" version
- Log error to console for debugging
- Don't block application startup
- Retry fetch after 5 seconds (max 3 retries)

**Cache Clear Failures**:
- If Cache API is not available, fall back to simple page reload
- If cache.delete() fails, log error but still reload page
- Show error toast if cache clear fails

**Invalid Version Data**:
- If version.json has invalid structure, use fallback version "Unknown"
- Log warning with details about what's invalid
- Continue application execution

## Testing Strategy

This feature requires both unit tests and property-based tests to ensure correctness across different scenarios.

### Unit Testing Approach

**Build Plugin Tests**:
- Test version.json generation with valid git repo
- Test version.json generation without git repo
- Test custom output file path
- Test development vs production environment detection
- Test timestamp format validation

**Version Hook Tests**:
- Test successful version fetch
- Test loading state during fetch
- Test error state on fetch failure
- Test caching behavior (no duplicate fetches)
- Test development mode mock data

**Version Badge Tests**:
- Test rendering with valid version data
- Test rendering in loading state
- Test rendering in error state
- Test click handler triggers cache refresh
- Test responsive styling on mobile/desktop

**Cache Refresh Tests**:
- Test cache clear with Cache API available
- Test fallback when Cache API unavailable
- Test confirmation dialog display
- Test page reload after cache clear

### Property-Based Testing Approach

Property-based tests will validate universal properties that should hold across all inputs and scenarios. Each test should run a minimum of 100 iterations with randomized inputs.

**Test Configuration**:
- Use fast-check library for TypeScript property-based testing
- Minimum 100 iterations per property test
- Each test tagged with: **Feature: mobile-cache-busting, Property {N}: {description}**


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property Reflection

After analyzing all acceptance criteria, I identified several redundant properties:
- Properties 1.1 and 1.2 (CSS and JS hashing) can be combined into a single property about all static assets
- Properties 3.2 and 3.3 (mobile and desktop visibility) can be combined into one property about visibility at all viewports
- Properties 6.1, 6.2, 7.1, 7.2, 7.3, 7.4, 7.5, and 8.2 are redundant with earlier properties
- Properties 6.4 and 6.5 can be combined into one property about cache headers

The following properties represent the unique, non-redundant correctness guarantees:

### Property 1: Static Asset Hashing

*For any* static asset file (CSS, JavaScript, images, fonts) processed by the build system, the output filename SHALL include a content-based hash.

**Validates: Requirements 1.1, 1.2, 7.1, 7.5**

**Testing approach**: Generate random file contents, run through build, verify output filenames match pattern `[name].[hash].[ext]` where hash is non-empty.

### Property 2: Hash Sensitivity to Content Changes

*For any* file content, if the content is modified and the file is rebuilt, the generated content hash SHALL be different from the original hash.

**Validates: Requirements 1.3, 7.2**

**Testing approach**: Generate random file content, build it, modify the content, rebuild, verify hashes are different.

### Property 3: Hash Stability for Unchanged Content

*For any* file content, if the file is built multiple times without modification, the generated content hash SHALL remain identical across all builds.

**Validates: Requirements 1.4**

**Testing approach**: Generate random file content, build it multiple times, verify all hashes are identical. This is an idempotence property.

### Property 4: Reference Integrity in HTML

*For any* hashed asset file in the build output, all references to that file in HTML files SHALL use the hashed filename, not the original unhashed filename.

**Validates: Requirements 1.5**

**Testing approach**: Generate random assets and HTML files with references, build them, verify HTML contains only hashed references.

### Property 5: Version Uniqueness by Timestamp

*For any* two builds executed at different timestamps, the generated version identifiers SHALL be different.

**Validates: Requirements 2.1, 6.2, 8.2**

**Testing approach**: Run builds at different times, verify version strings are unique.

### Property 6: Git Information Inclusion

*For any* build executed in a git repository with available git commands, the generated version information SHALL include the git commit hash.

**Validates: Requirements 2.2**

**Testing approach**: Run builds in mock git repos with different commits, verify version.json includes commit hashes.

### Property 7: Version JSON Validity

*For any* generated version.json file, the content SHALL be valid JSON that can be parsed without errors.

**Validates: Requirements 2.3**

**Testing approach**: Generate version files under various conditions, verify all can be parsed as valid JSON.

### Property 8: Version Hook API Contract

*For any* version data returned by the useVersion hook, the data SHALL conform to the VersionData interface with all required fields present.

**Validates: Requirements 2.4**

**Testing approach**: Call hook with various version.json contents, verify returned data structure matches interface.

### Property 9: Version Display Rendering

*For any* valid version string, the VersionBadge component SHALL render output that contains the version string.

**Validates: Requirements 3.1, 7.4**

**Testing approach**: Render component with random version strings, verify rendered output includes the string.

### Property 10: Development Mode Display

*For any* application state where environment is set to 'development', the VersionBadge SHALL display "DEV" instead of a version number.

**Validates: Requirements 3.5**

**Testing approach**: Render component with environment='development', verify output contains "DEV".

### Property 11: Code Splitting Preservation

*For any* existing code splitting configuration in the Vite config, after adding cache busting configuration, the code splitting SHALL continue to function identically.

**Validates: Requirements 5.2**

**Testing approach**: Compare chunk outputs before and after cache busting changes, verify chunk boundaries are preserved.

### Property 12: Lazy Loading Preservation

*For any* lazy-loaded component in the application, after adding cache busting configuration, the component SHALL still load lazily with the same behavior.

**Validates: Requirements 5.3**

**Testing approach**: Test lazy loading behavior before and after changes, verify loading patterns are identical.

### Property 13: Cache Header Configuration

*For any* hashed static asset served by the application, the HTTP response SHALL include cache-control headers that allow long-term caching (max-age >= 31536000).

**Validates: Requirements 6.4, 6.5**

**Testing approach**: Generate random assets, build them, verify Vite config sets appropriate cache headers for hashed files.

### Property 14: Import Statement Compatibility

*For any* existing CSS or JavaScript import statement in the codebase, after implementing cache busting, the import SHALL continue to work without modification.

**Validates: Requirements 8.3**

**Testing approach**: Collect all import statements, verify they work before and after cache busting implementation.

### Property 15: Configuration Error Messages

*For any* invalid plugin configuration (wrong types, missing required fields, invalid values), the build system SHALL fail with a clear error message describing the specific validation failure.

**Validates: Requirements 8.5**

**Testing approach**: Generate random invalid configurations, verify each produces a descriptive error message.

### Example-Based Tests

The following criteria are best tested with specific examples rather than properties:

**Console Logging on Startup** (Requirement 2.5):
- Test: Application starts, verify console.log called with version info
- This is a specific behavior at a specific time, not a universal property

**Click Handler Presence** (Requirement 4.1):
- Test: Render VersionBadge, verify onClick handler is attached
- This is testing a specific implementation detail

**Cache Clear on Click** (Requirement 4.2):
- Test: Click badge, verify cache.delete() is called
- This is testing a specific user interaction

**Page Reload on Click** (Requirement 4.3):
- Test: Click badge, verify location.reload() is called
- This is testing a specific user interaction

**Confirmation Message Display** (Requirement 4.4):
- Test: Trigger cache refresh, verify toast notification appears
- This is testing a specific UI feedback mechanism

**Build Automation** (Requirement 8.1):
- Test: Run build process, verify it completes without user input
- This is testing the build process itself, not a code property

### Edge Cases

The following edge cases should be handled by property test generators:

**Viewport Visibility** (Requirements 3.2, 3.3):
- Generators should test various viewport widths including boundaries (767px, 768px, 769px)
- Ensure component is visible at all tested widths

**Git Unavailability**:
- Generators should test builds with and without git available
- Ensure graceful degradation when git commands fail

**Network Failures**:
- Generators should test version.json fetch with network errors
- Ensure application continues to function with fallback version
