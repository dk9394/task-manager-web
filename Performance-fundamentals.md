# Angular Performance Fundamentals — A Hands-On Learning Module

> **Project:** task-manager-web (Angular 19 + NgRx 19 + PrimeNG 19)
> **Goal:** Master performance monitoring, analysis, and optimization with real scenarios and measurable improvements.
> **Approach:** Build intentionally slow features → Measure baselines → Fix step-by-step → Show % improvement

---

## Table of Contents

| Part | Topic | Status |
|------|-------|--------|
| 1 | Performance Monitoring Toolkit Setup | ✅ |
| 2 | Angular Change Detection & Signals Deep Dive | ⬜ |
| 3 | Crafting Scenario 1 — Heavy List Rendering | ⬜ |
| 4 | Fixing Scenario 1 — Core Angular Optimizations | ⬜ |
| 5 | Installing & Setting Up ag-Grid | ⬜ |
| 6 | Crafting Scenario 2 — ag-Grid Performance Bottleneck | ⬜ |
| 7 | Fixing Scenario 2 — ag-Grid Optimization | ⬜ |
| 8 | Crafting Scenario 3 — Heavy Computation & Memory Leaks | ⬜ |
| 9 | Fixing Scenario 3 — Memory & Computation Optimization | ⬜ |
| 10 | Bundle Size & Lazy Loading | ⬜ |
| 11 | Runtime Performance Patterns & Anti-Patterns (Signals-First) | ⬜ |
| 12 | Performance Monitoring Dashboard & CI Integration | ⬜ |

---

## Part 1: Performance Monitoring Toolkit Setup

### Why This Matters

You can't improve what you can't measure. Before writing a single line of optimization code, you need to know **how to observe** what's happening inside your Angular application. Professional Angular developers use a combination of browser-native tools and Angular-specific tools to:

- **Identify** which components are slow
- **Quantify** how slow they are (in milliseconds, FPS, or memory MB)
- **Verify** that a fix actually improved performance (before/after comparison)
- **Present** improvements to stakeholders with concrete numbers

This part covers the four essential tools you'll use throughout this entire module.

---

### Tool 1: Chrome DevTools — Performance Tab

The Performance tab is the single most powerful tool for understanding **what your application does over time**. It records everything the browser does — JavaScript execution, rendering, painting — and shows it as a flame chart.

#### How to Open It

1. Open your Angular app in Chrome (`ng serve` → `http://localhost:4200`)
2. Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
3. Click the **Performance** tab

#### Recording a Performance Profile

1. Click the **Record** button (circle icon) or press `Cmd+E` / `Ctrl+E`
2. Perform the action you want to measure (e.g., scroll a list, click a button, load a page)
3. Click **Stop** after 3-5 seconds

#### Reading the Flame Chart

After recording, you'll see several lanes:

**Timeline Overview (top bar):**
- Green bars = FPS (frames per second). Taller = better. Ideal: 60 FPS
- Red triangles above the bars = dropped frames (jank)
- Yellow = JavaScript execution time
- Purple = Rendering/Layout
- Green = Painting

**Main Thread (flame chart):**
- Each bar represents a function call
- Width = how long it took
- Depth = call stack (what called what)
- **Long yellow bars** = expensive JavaScript — this is where you find bottlenecks
- Look for functions that take >16ms (that's your budget for 60 FPS)

**Key Metrics in the Summary Panel (bottom):**

| Metric | What It Means | Good Value |
|--------|--------------|------------|
| Scripting | Time spent executing JS | < 50% of total |
| Rendering | Time spent calculating layouts | < 20% of total |
| Painting | Time spent drawing pixels | < 10% of total |
| Idle | Time doing nothing (good!) | > 30% of total |

#### What to Look For

- **Long Tasks**: Any task >50ms is a "Long Task" and will cause visible jank. Chrome highlights these with a red corner
- **Forced Reflows**: When JS reads layout properties (e.g., `offsetHeight`) after modifying the DOM — causes layout thrashing
- **Excessive Change Detection**: In Angular, you'll see `ApplicationRef.tick()` calls. If these happen too frequently or take too long, that's your bottleneck
- **Zone.js triggers**: Look for `ZoneTask.invokeTask` — every one of these triggers Angular change detection

#### Practice Exercise

```
1. Run your app: ng serve
2. Open Chrome DevTools → Performance tab
3. Enable "Screenshots" checkbox (top-left of Performance panel)
4. Click Record
5. Navigate from login to dashboard (or any page transition)
6. Stop recording after 3 seconds
7. Find the longest task in the flame chart
8. Note down: Total time, Scripting %, Rendering %, Idle %
```

**Record your baseline numbers here:**

| Metric | Your Value |
|--------|-----------|
| Total Recording Time | ___ ms |
| Scripting | ___ % |
| Rendering | ___ % |
| Painting | ___ % |
| Idle | ___ % |
| Longest Task | ___ ms |

---

### Tool 2: Chrome DevTools — Memory Tab

Memory leaks are silent killers. Your app might look fast initially but slow down over time as leaked objects accumulate. The Memory tab helps you find them.

#### Three Memory Profiling Modes

**1. Heap Snapshot** — Takes a photo of everything in memory right now
- Best for: Finding what objects are taking up memory
- How: Click "Take Snapshot" → Browse the results
- Look for: Objects with unexpectedly high "Retained Size"

**2. Allocation Timeline** — Records memory allocations over time
- Best for: Finding memory leaks (objects that grow but never shrink)
- How: Click "Start" → Use the app → Click "Stop"
- Look for: Blue bars that never turn gray (allocated but never garbage collected)

**3. Allocation Sampling** — Lightweight profiling of where allocations happen
- Best for: Understanding which functions allocate the most memory
- How: Click "Start" → Use the app → Click "Stop"
- Look for: Functions at the top of the "Self Size" column

#### Reading a Heap Snapshot

After taking a snapshot, you'll see a table with columns:

| Column | Meaning |
|--------|---------|
| Constructor | The type/class of the object |
| Distance | How far from the GC root (lower = more likely to be retained) |
| Shallow Size | Memory used by the object itself |
| Retained Size | Memory that would be freed if this object was garbage collected |

**Key things to look for:**
- **(string)** with large retained size — often template strings or JSON data held in memory
- **Detached HTMLDivElement** — DOM nodes that were removed but still referenced in JS (leak!)
- **Array** or **Object** with unexpected counts — data structures that keep growing
- Your component class names appearing after navigation away — they should be garbage collected

#### Comparing Snapshots (Finding Leaks)

This is the most powerful technique:

1. Take **Snapshot 1** (baseline)
2. Perform an action (e.g., navigate to a page and back)
3. Click the trash can icon to force garbage collection
4. Take **Snapshot 2**
5. In Snapshot 2, change the dropdown from "Summary" to **"Comparison"**
6. Select Snapshot 1 as the baseline
7. Look at the **"# Delta"** column — positive numbers mean new objects were created but not cleaned up

If navigating to a page and back creates objects that aren't cleaned up — you have a memory leak.

#### Practice Exercise

```
1. Open Chrome DevTools → Memory tab
2. Select "Heap Snapshot" → Take snapshot (this is your baseline)
3. Navigate around your app (login → dashboard → back to login)
4. Click the trash can icon (Force GC)
5. Take another snapshot
6. Switch to "Comparison" view against Snapshot 1
7. Look for any objects with positive # Delta
```

**Record your findings:**

| Metric | Your Value |
|--------|-----------|
| Snapshot 1 Size | ___ MB |
| Snapshot 2 Size | ___ MB |
| Size Difference | ___ MB |
| Detached DOM Nodes | ___ count |
| Largest Leaked Object | ___ (name) |

---

### Tool 3: Angular DevTools

Angular DevTools is a Chrome extension built specifically for Angular applications. It understands Angular's component tree, change detection, and dependency injection.

#### Installation

1. Install from Chrome Web Store: search "Angular DevTools"
2. After installation, open DevTools (`F12`) and you'll see two new tabs:
   - **Components** — The component tree
   - **Profiler** — Change detection profiler

#### Components Tab

This shows your entire component tree, similar to React DevTools:

- Click any component to see its **properties**, **inputs**, **outputs**, and **injected services**
- The tree updates in real-time as components are created/destroyed
- Use the search bar to find components by name

**Performance-relevant features:**
- **Change Detection indicator**: When profiling is active, components that re-render are highlighted
- **Component properties**: Check if components hold large data structures that could be memoized

#### Profiler Tab — This Is Your Most Important Angular Tool

The Profiler records every change detection cycle and tells you:
- **How many cycles** ran during the recording
- **How long each cycle took** (in ms)
- **Which components** were checked in each cycle
- **What triggered** the cycle (event, timer, HTTP response, etc.)

**How to use it:**

1. Go to the **Profiler** tab in Angular DevTools
2. Click the **Record** button (circle)
3. Interact with your app (click buttons, type in forms, scroll)
4. Click **Stop**
5. You'll see a bar chart — each bar is one change detection cycle

**Reading the results:**

- **Bar height** = Time taken for that cycle (taller = slower)
- Click a bar to see which components were checked
- **Red bars** = Cycles that took >16ms (frame budget exceeded)
- The component breakdown shows time per component — find the slowest ones

**What triggers change detection (each one = a bar in the profiler):**
- Any DOM event (click, input, mouseover, scroll)
- `setTimeout` / `setInterval` callbacks
- HTTP responses
- Promise resolutions
- Manual `ChangeDetectorRef.detectChanges()` or `markForCheck()`

**The key insight**: If you see 100+ bars for a simple scroll action, your app is running too many change detection cycles. This is where OnPush and Signals make a massive difference.

#### Practice Exercise

```
1. Install Angular DevTools from Chrome Web Store
2. Open your app and go to DevTools → "Components" tab
3. Explore the component tree — find your LoginComponent
4. Switch to the "Profiler" tab
5. Click Record
6. Type in the email field, then the password field, then click Login
7. Stop recording
8. Count how many CD cycles were triggered
9. Find the slowest cycle and note which component caused it
```

**Record your findings:**

| Metric | Your Value |
|--------|-----------|
| Total CD Cycles | ___ count |
| Average Cycle Duration | ___ ms |
| Slowest Cycle Duration | ___ ms |
| Slowest Component | ___ (name) |
| CD Cycles per Keystroke | ___ count |

---

### Tool 4: Lighthouse

Lighthouse is an automated auditing tool that grades your app on Performance, Accessibility, Best Practices, and SEO. It simulates a real user on a mid-tier device with a slow network.

#### How to Run It

**Option 1: Chrome DevTools**
1. Open DevTools → **Lighthouse** tab
2. Select categories: check **Performance** (and optionally others)
3. Select device: **Mobile** (more realistic) or **Desktop**
4. Click **Analyze page load**

**Option 2: Command Line (more consistent results)**
```bash
# Install globally
npm install -g lighthouse

# Run against your dev server
lighthouse http://localhost:4200 --view

# Run with specific settings
lighthouse http://localhost:4200 --preset=desktop --output=html --output-path=./lighthouse-report.html
```

#### Understanding the Performance Score

Lighthouse gives a score from 0-100 based on these weighted metrics:

| Metric | Weight | What It Measures | Good | Needs Work | Poor |
|--------|--------|-----------------|------|------------|------|
| **FCP** (First Contentful Paint) | 10% | Time until first text/image appears | < 1.8s | 1.8-3s | > 3s |
| **LCP** (Largest Contentful Paint) | 25% | Time until largest content element renders | < 2.5s | 2.5-4s | > 4s |
| **TBT** (Total Blocking Time) | 30% | Sum of blocking time for long tasks | < 200ms | 200-600ms | > 600ms |
| **CLS** (Cumulative Layout Shift) | 25% | How much the page layout shifts unexpectedly | < 0.1 | 0.1-0.25 | > 0.25 |
| **SI** (Speed Index) | 10% | How quickly content is visually displayed | < 3.4s | 3.4-5.8s | > 5.8s |

**Note on INP (Interaction to Next Paint):**
Starting 2024, Google replaced FID with INP as a Core Web Vital. INP measures the latency of ALL interactions (clicks, taps, key presses) throughout the page lifecycle — not just the first one. Lighthouse doesn't directly score INP yet, but Chrome DevTools Performance tab shows it.

| INP Rating | Value |
|-----------|-------|
| Good | < 200ms |
| Needs Improvement | 200-500ms |
| Poor | > 500ms |

#### Key Lighthouse Opportunities & Diagnostics

After the audit, Lighthouse shows two sections:

**Opportunities** — Things you can fix to improve loading:
- "Reduce unused JavaScript" → You have code that's loaded but never executed (tree-shaking issue)
- "Properly size images" → Images are larger than their display size
- "Eliminate render-blocking resources" → CSS/JS files that block the first paint

**Diagnostics** — Additional information about performance:
- "Avoid enormous network payloads" → Your bundles are too large
- "Minimize main-thread work" → Too much JavaScript execution
- "Avoid excessive DOM size" → Too many DOM nodes (common with large lists!)
- "Reduce JavaScript execution time" → Specific scripts that are slow

#### Practice Exercise

```
1. Run Lighthouse on your app:
   - Open DevTools → Lighthouse tab
   - Select "Performance" + "Desktop" mode
   - Click "Analyze page load"
2. Record the Performance score and all 5 metrics
3. Run it again with "Mobile" mode
4. Compare the scores
```

**Record your baseline:**

| Metric | Desktop | Mobile |
|--------|---------|--------|
| Performance Score | ___/100 | ___/100 |
| FCP | ___ s | ___ s |
| LCP | ___ s | ___ s |
| TBT | ___ ms | ___ ms |
| CLS | ___ | ___ |
| SI | ___ s | ___ s |

---

### Tool 5: Custom Performance Measurement with `performance.now()`

While the tools above give you macro-level insights, sometimes you need to measure specific operations in your code. The `performance.now()` API gives you high-resolution timestamps (microsecond precision).

#### Basic Usage Pattern

```typescript
// Measuring a specific operation
const start = performance.now();

// ... the operation you want to measure ...
this.processLargeDataset(data);

const end = performance.now();
console.log(`processLargeDataset took ${(end - start).toFixed(2)}ms`);
```

#### Using Performance Marks and Measures (Better Approach)

Marks and Measures integrate with Chrome DevTools Performance tab — they appear as labeled bars in the timeline:

```typescript
// Place marks at key points
performance.mark('data-processing-start');

this.processLargeDataset(data);

performance.mark('data-processing-end');

// Create a named measure between marks
performance.measure(
  'Data Processing',           // Name (appears in DevTools)
  'data-processing-start',     // Start mark
  'data-processing-end'        // End mark
);

// Read the measurement
const measure = performance.getEntriesByName('Data Processing')[0];
console.log(`Data Processing: ${measure.duration.toFixed(2)}ms`);

// Clean up (optional but good practice)
performance.clearMarks();
performance.clearMeasures();
```

#### Angular-Specific Measurement Pattern

Here's a pattern you'll use throughout this module to measure component operations:

```typescript
import { Component, OnInit } from '@angular/core';

@Component({ /* ... */ })
export class HeavyListComponent implements OnInit {

  ngOnInit(): void {
    performance.mark('heavy-list-init-start');

    this.loadData();
    this.processData();
    this.renderList();

    performance.mark('heavy-list-init-end');
    performance.measure('HeavyList Init', 'heavy-list-init-start', 'heavy-list-init-end');

    const measure = performance.getEntriesByName('HeavyList Init')[0];
    console.log(`HeavyList initialization: ${measure.duration.toFixed(2)}ms`);
  }
}
```

#### Measuring Change Detection Cost

A powerful technique — wrap Angular's change detection tick to see how long each cycle takes:

```typescript
// In your AppComponent or a dev-only service
import { ApplicationRef, inject } from '@angular/core';

export class PerformanceDebugService {
  private appRef = inject(ApplicationRef);
  private cdCount = 0;

  startMonitoring(): void {
    const originalTick = this.appRef.tick.bind(this.appRef);

    this.appRef.tick = () => {
      this.cdCount++;
      const start = performance.now();
      originalTick();
      const duration = performance.now() - start;

      if (duration > 5) {  // Only log slow cycles
        console.warn(`CD Cycle #${this.cdCount}: ${duration.toFixed(2)}ms`);
      }
    };
  }
}
```

> **Note**: This monkey-patching technique is for **development debugging only**. Never ship this to production.

#### Practice Exercise

```
1. Open your login.component.ts
2. Add performance marks around the form initialization:
   - Mark before initializeForm()
   - Mark after initializeForm()
   - Measure and log the duration
3. Type in the email field 10 times and observe the console
4. Do you see any change detection-related performance entries?
```

---

### Putting It All Together: The Performance Baseline Workflow

Before optimizing anything, always capture a complete baseline. Here's the workflow you'll follow for every scenario in this module:

#### Step 1: Lighthouse Audit
```bash
# Run Lighthouse in Desktop mode
lighthouse http://localhost:4200/performance-lab --preset=desktop --output=html --output-path=./perf-reports/baseline-lighthouse.html
```
Record: Performance Score, FCP, LCP, TBT, CLS

#### Step 2: Chrome DevTools Performance Recording
1. Open Performance tab
2. Enable Screenshots + Memory checkbox
3. Record for 5 seconds while interacting with the feature
4. Record: Total time, Scripting %, Longest Task, FPS range

#### Step 3: Angular DevTools Profiler
1. Open Profiler tab
2. Record during the same interaction
3. Record: Total CD cycles, Average cycle duration, Slowest component

#### Step 4: Memory Baseline
1. Take Heap Snapshot (Snapshot 1)
2. Perform the interaction
3. Force GC
4. Take Heap Snapshot (Snapshot 2)
5. Compare: Record size delta, detached nodes

#### Step 5: Custom Code Measurements
- Add `performance.mark()` / `performance.measure()` around critical operations
- Record: Initialization time, data processing time

#### Baseline Template

Use this template for every scenario:

```
=== PERFORMANCE BASELINE: [Scenario Name] ===
Date: ____
Build: ng serve (development)

--- Lighthouse (Desktop) ---
Score: ___/100 | FCP: ___s | LCP: ___s | TBT: ___ms | CLS: ___

--- Chrome Performance Tab (5s recording) ---
Scripting: ___% | Rendering: ___% | Painting: ___% | Idle: ___%
Longest Task: ___ms | FPS Range: ___-___

--- Angular DevTools Profiler ---
CD Cycles: ___ | Avg Duration: ___ms | Slowest: ___ms (Component: ___)

--- Memory ---
Snapshot 1: ___MB | Snapshot 2: ___MB | Delta: ___MB
Detached Nodes: ___

--- Custom Measurements ---
[Operation 1]: ___ms
[Operation 2]: ___ms
```

---

### Summary — Your Performance Toolkit

| Tool | Best For | When to Use |
|------|----------|-------------|
| **Chrome Performance Tab** | Finding slow functions, long tasks, jank | Any rendering/scripting bottleneck |
| **Chrome Memory Tab** | Finding memory leaks, large objects | App slowing down over time |
| **Angular DevTools Profiler** | Counting CD cycles, finding slow components | Too many re-renders, CD overhead |
| **Lighthouse** | Overall score, loading performance, Core Web Vitals | Initial audit, before/after comparison |
| **`performance.now()` / marks** | Measuring specific code operations | Precise timing of known bottlenecks |

**Key Principle**: Always measure first, optimize second, then measure again to verify improvement. A "fix" without measurement is just guessing.

---

*Next: Part 2 — Angular Change Detection & Signals Deep Dive →*
