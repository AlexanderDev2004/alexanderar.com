<script lang="ts">
  import type { EducationItem } from '../data/education';

  export let items: EducationItem[] = [];

  let expandedIndex = -1;

  const defaultCoursework = [
    'Data Structures',
    'Algorithms',
    'Database Systems',
    'Software Engineering',
    'Computer Networks',
    'Operating Systems',
    'Artificial Intelligence',
    'Machine Learning'
  ];

  const defaultSkills = [
    'Team Communication',
    'Good Project Management',
    'Collaborative Problem Solving'
  ];

  function toggleExpand(index: number) {
    expandedIndex = expandedIndex === index ? -1 : index;
  }

  function formatEndDate(endDate: string | null | undefined) {
    return endDate === null || endDate === undefined || endDate === '' ? 'Present' : endDate;
  }

  function getCoursework(item: EducationItem) {
    return item.relevantCoursework && item.relevantCoursework.length > 0
      ? item.relevantCoursework
      : defaultCoursework;
  }

  function getSkills(item: EducationItem) {
    return item.skills && item.skills.length > 0
      ? item.skills
      : defaultSkills;
  }
</script>

<div class="space-y-3">
  {#if items.length > 0}
    {#each items as item, index (index)}
      <div
        class="surface-item rounded-lg transition-colors overflow-hidden reveal"
        style={`--reveal-delay: ${index}`}
      >
        <button
          type="button"
          onclick={(e) => { e.preventDefault(); toggleExpand(index); }}
          class="w-full text-left p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 hover:bg-opacity-50 cursor-pointer pressable"
        >
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h3
                class="text-base sm:text-lg font-bold primary-text text-green-500"
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700;"
              >
                {item.degree}
              </h3>
            </div>

            <p class="text-xs sm:text-sm muted-text mt-1" style="font-family: 'Plus Jakarta Sans', sans-serif;">
              {item.institution}
            </p>
          </div>

          <div class="flex items-center justify-between sm:justify-end gap-3 text-xs sm:text-sm muted-text sm:ml-auto">
            <span class="whitespace-nowrap">
              {item.startDate} - {formatEndDate(item.endDate)}
            </span>
            <svg
              class="w-5 h-5 transition-transform duration-300 {expandedIndex === index ? 'rotate-180' : ''}"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </button>

        {#if expandedIndex === index}
          <div class="px-4 sm:px-5 pb-4 sm:pb-5 space-y-4 expand-reveal" style="border-top: 1px solid var(--surface-border);">
            {#if item.gpa}
              <div class="education-gpa inline-flex items-center gap-2 px-3 py-2 rounded-lg">
                <span class="text-[11px] sm:text-xs font-semibold uppercase tracking-wide muted-text">Cumulative GPA</span>
                <strong class="education-gpa-value text-sm sm:text-base">{item.gpa}</strong>
              </div>
            {/if}

            <div class="space-y-2">
              <h4 class="text-xs sm:text-sm font-semibold uppercase tracking-wide primary-text">Relevant Coursework</h4>
              <div class="flex flex-wrap gap-2">
                {#each getCoursework(item) as course}
                  <span class="pill-chip px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-medium">
                    {course}
                  </span>
                {/each}
              </div>
            </div>

            <div class="space-y-2">
              <h4 class="text-xs sm:text-sm font-semibold uppercase tracking-wide primary-text">Key Strengths</h4>
              <ul class="education-list list-disc list-inside space-y-1 text-xs sm:text-sm muted-text">
                {#each getSkills(item) as skill}
                  <li>{skill}</li>
                {/each}
              </ul>
            </div>
          </div>
        {/if}
      </div>
    {/each}
  {:else}
    <div class="text-center py-8">
      <p class="muted-text">Sorry, studies are not available.</p>
    </div>
  {/if}
</div>

<style>
  .education-gpa {
    border: 1px solid var(--accent);
    background: var(--accent-soft);
  }

  .education-gpa-value {
    color: var(--accent-strong);
    font-weight: 750;
    letter-spacing: 0.01em;
  }

  .education-list :global(li) {
    margin-left: 0.5rem;
  }
</style>
