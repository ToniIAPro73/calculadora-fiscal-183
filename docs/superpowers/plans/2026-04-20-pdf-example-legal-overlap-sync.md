# PDF Example, Legal Copy, Overlap Indicators, and Repo Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sync the local branch with `origin/main`, then fix the example PDF flow, legal copy, DNI/passport modal, overlap indicators, and premium PDF layout so the app and generated report stay consistent.

**Architecture:** Keep the app data model centered on date ranges and derived unique-day totals, then reuse that data for the on-screen list, the overlap warning UI, the example PDF, and the downloadable report. The PDF work should be isolated behind a small report generator component or helper so the same legal metadata, logo treatment, and period table can be rendered for both the static example file and the generated report artifact.

**Tech Stack:** React 18, Vite, Tailwind CSS, `date-fns`, `lucide-react`, browser tooltips, PDF generation utilities already present in the repo.

---

### Task 1: Sync the branch and preserve the local report commit

**Files:**
- Modify: `.git` state only
- Test: `git status --short --branch`, `git log --oneline --decorate --graph --max-count=12 --all`

- [ ] **Step 1: Fetch the remote and inspect the divergence**

Run:
```bash
git fetch origin
git log --oneline origin/main..main
git log --oneline main..origin/main
```
Expected: exactly one local commit (`pdf generado`) and three remote-only commits.

- [ ] **Step 2: Rebase or merge the local commit on top of `origin/main`**

Run:
```bash
git rebase origin/main
```
Expected: the local report commit is replayed on top of the three remote commits without losing changes.

- [ ] **Step 3: Verify the branch is synchronized after the rebase**

Run:
```bash
git status --short --branch
git log --oneline --decorate --graph --max-count=12 --all
```
Expected: branch is no longer behind `origin/main`; if new implementation commits are added later, the branch should remain pushable cleanly.

### Task 2: Add shared report metadata and example-PDF entry point

**Files:**
- Create: `src/lib/reportMetadata.js`
- Modify: `src/components/Header.jsx`
- Modify: `src/pages/TaxNomadCalculator.jsx`
- Modify: `src/components/UserDetailsModal.jsx`
- Test: run the app and click the example button once the feature is wired

- [ ] **Step 1: Create a shared metadata module**

Add a small helper that exports the legal identity fields, report title, brand label, and a `buildExampleReportData()` function returning fictitious sample person/period data used only by the example button.

```js
export const reportOwner = {
  name: 'Antonio Ballesteros Alonso',
  address: 'Carrer Miquel Rosselló i Alemany, 48 07015 Palma de Mallorca (España)',
  nif: '08997554T',
  email: 'hola@regla183.com',
};

export const buildExampleReportData = () => ({
  subject: {
    name: 'Alex Rivera',
    identifierLabel: 'Pasaporte',
    identifierValue: 'X1234567Z',
  },
  periods: [
    { start: '2026-01-05', end: '2026-01-20' },
    { start: '2026-03-02', end: '2026-03-18' },
    { start: '2026-08-11', end: '2026-08-23' },
  ],
});
```

- [ ] **Step 2: Point the header example button to the real example flow**

Replace the dead `/example-report.pdf` open call with a safe route or generated data source that opens a real example report file or in-app preview.

```jsx
<Button
  variant="ghost"
  size="sm"
  onClick={onOpenExample}
  className="hidden md:flex text-muted-foreground hover:text-primary gap-2 font-semibold"
>
  <Eye className="w-4 h-4" />
  {language === 'es' ? 'Ver ejemplo' : 'View example'}
</Button>
```

- [ ] **Step 3: Feed the modal and report builder from the same legal and example data**

Update `TaxNomadCalculator.jsx` so the purchase/download flow can build:
```js
{
  owner: reportOwner,
  subject: userData,
  periods: selectedRanges,
  totalDays,
  exampleMode: false
}
```
and the example button can build the same shape with fictitious values and `exampleMode: true`.

- [ ] **Step 4: Keep the modal state minimal and explicit**

Make the modal accept only the selected identifier type and remove the DNI option entirely from the form state and display copy.

### Task 3: Remove DNI from the modal and add overlap hints in the range list

**Files:**
- Modify: `src/components/UserDetailsModal.jsx`
- Modify: `src/components/RangeList.jsx`
- Modify: `src/lib/dateRangeMerger.js`
- Modify: `src/lib/translations.js`
- Test: add two overlapping periods and confirm the warning marker appears only on affected ranges

- [ ] **Step 1: Narrow the identifier choice to Pasaporte and NIE**

Render a compact selector or copy that excludes DNI, with validation requiring one of the two supported document types.

```jsx
const identifierOptions = [
  { value: 'passport', label: 'Pasaporte' },
  { value: 'nie', label: 'NIE' },
];
```

- [ ] **Step 2: Extend range merging output so overlaps can be traced back to their source period**

Update the merger helper to return per-range overlap metadata instead of only a boolean, so the UI can mark only the ranges whose days were absorbed by other ranges.

```js
{
  merged,
  hasOverlap,
  overlapByRange: [
    { index: 0, overlappedDays: 3 },
    { index: 2, overlappedDays: 1 }
  ]
}
```

- [ ] **Step 3: Add the visual alert icon and hover tooltip**

In the range list, show a small alert icon on affected rows and a tooltip explaining that overlapping days were excluded from the total.

```jsx
{range.overlappedDays > 0 && (
  <Tooltip>
    <TooltipTrigger asChild>
      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
    </TooltipTrigger>
    <TooltipContent>
      Este periodo tiene días solapados con otros periodos. No se han contado en el total.
    </TooltipContent>
  </Tooltip>
)}
```

- [ ] **Step 4: Localize the warning strings**

Add English and Spanish copy for the overlap indicator and modal identifier labels.

### Task 4: Replace the PDF layout with a premium report renderer and fix the logo overlap

**Files:**
- Modify: `TaxNomad_Informe_Antonio_Ballesteros_Alonso_2026.pdf` or regenerate it from source
- Create: `src/lib/reportPdf.js`
- Modify: `src/pages/TaxNomadCalculator.jsx`
- Modify: `public/favicon.svg`
- Test: render the PDF example and the downloadable PDF, then inspect the output visually

- [ ] **Step 1: Create a dedicated PDF renderer**

Build a small report renderer that takes the shared report payload and lays out:
header, legal identity block, summary block, multi-period table, conclusion, and legal footer.

```js
export function buildReportPdf(report) {
  // render logo in a separate block above the green seal
  // render periods as a table with columns: start, end, days
  // render example-mode watermark/callout only when exampleMode is true
}
```

- [ ] **Step 2: Rework the top banner so the green "SEGURO" badge no longer overlaps the logo**

Place the logo and badge in separate visual lanes with deliberate spacing and shrink the logo only if necessary for the available width.

- [ ] **Step 3: Render multiple periods as a premium table**

If the report contains more than one period, display all rows in a bordered table with consistent spacing, right-aligned numeric cells, and a total row.

- [ ] **Step 4: Refresh the favicon and in-app brand mark if needed**

Use a cleaner shield/logo SVG so the app brand matches the PDF header treatment.

### Task 5: Update legal pages with the requested identity details

**Files:**
- Modify: `src/pages/PrivacyPolicy.jsx`
- Modify: `src/pages/TermsOfService.jsx`
- Modify: `src/components/Footer.jsx`
- Modify: `src/lib/translations.js`

- [ ] **Step 1: Insert the legal identity block into privacy and terms**

Add the requested name, address, NIF, and email in a dedicated legal contact section.

```jsx
<p>Antonio Ballesteros Alonso</p>
<p>Carrer Miquel Rosselló i Alemany, 48 07015 Palma de Mallorca (España)</p>
<p>08997554T</p>
<p>hola@regla183.com</p>
```

- [ ] **Step 2: Keep the footer contact details consistent**

Update any footer or contact strings that still point to the older placeholder address/email.

- [ ] **Step 3: Align the translation strings**

Ensure the legal and report copy in Spanish and English uses the same contact data and terminology.

### Task 6: Verify the app, rebuild the PDF, and commit the implementation

**Files:**
- Modify: whatever the implementation changes require
- Test: `npm run build`, visual browser checks, PDF text/render checks

- [ ] **Step 1: Run the full build**

Run:
```bash
npm run build
```
Expected: Vite build succeeds with no new errors.

- [ ] **Step 2: Verify the browser flow**

Check that:
```text
- "Ver ejemplo" opens the example report preview
- the modal no longer shows DNI
- overlap badges appear on affected periods
- the downloadable PDF reflects the new layout
```

- [ ] **Step 3: Regenerate or replace the root PDF artifact**

Confirm the tracked PDF file matches the new template and no longer shows the overlap bug or badge collision.

- [ ] **Step 4: Commit the work**

Run:
```bash
git add .
git commit -m "feat: improve report pdf and overlap handling"
```
Expected: a clean commit that can be pushed on top of the synced branch.
