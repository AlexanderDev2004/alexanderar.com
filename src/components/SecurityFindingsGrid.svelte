<script>
  export let items = [];

  function severityColor(severity) {
    switch (severity) {
      case 'Critical': return 'severity-critical';
      case 'High': return 'severity-high';
      case 'Medium': return 'severity-medium';
      case 'Low': return 'severity-low';
      default: return '';
    }
  }
</script>

{#if items.length > 0}
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each items as finding (finding.id)}
      <div class="group surface-item rounded-lg overflow-hidden transition-colors flex flex-col">
        <div class="finding-fallback h-40 flex items-center justify-center">
          <iconify-icon icon="mdi:shield-lock-outline" width="72" height="72" class="text-white"></iconify-icon>
        </div>

        <div class="p-5 flex flex-col flex-1">
          <div class="flex items-center gap-2 mb-2 flex-wrap">
            <span class="severity-badge {severityColor(finding.severity)} text-xs font-bold px-2.5 py-0.5 rounded">
              {finding.severity}
            </span>
            <span class="pill-chip text-xs font-semibold px-2 py-0.5 muted-text">
              {finding.date}
            </span>
          </div>

          <h3 
            class="text-base font-bold primary-text mb-2"
            style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700;"
          >
            {finding.title}
          </h3>

          <p class="text-sm muted-text line-clamp-3 mb-4 flex-1">
            {finding.summary}
          </p>

          <div class="flex items-center gap-2 mb-3 flex-wrap">
            <span class="pill-chip px-2 py-1 text-xs">{finding.cwe}</span>
            <span class="pill-chip px-2 py-1 text-xs">{finding.owasp}</span>
          </div>

          {#if finding.tags && finding.tags.length > 0}
            <div class="flex flex-wrap gap-1.5 mb-3">
              {#each finding.tags.slice(0, 3) as tag}
                <span class="pill-chip px-2 py-1 text-xs">{tag}</span>
              {/each}
              {#if finding.tags.length > 3}
                <span class="pill-chip px-2 py-1 text-xs">+{finding.tags.length - 3}</span>
              {/if}
            </div>
          {/if}

          {#if finding.reportLink}
            <a 
              href={finding.reportLink}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 text-sm accent-link hover:underline font-medium mt-auto"
            >
              <span>View Report</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          {/if}
        </div>
      </div>
    {/each}
  </div>
{:else}
  <div class="text-center py-8">
    <p class="muted-text">No security findings yet.</p>
  </div>
{/if}

<style>
  .severity-badge {
    line-height: 1.6;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .severity-critical {
    background: rgba(239, 68, 68, 0.2);
    color: #fca5a5;
    border: 1px solid rgba(239, 68, 68, 0.4);
  }

  .severity-high {
    background: rgba(249, 115, 22, 0.2);
    color: #fdba74;
    border: 1px solid rgba(249, 115, 22, 0.4);
  }

  .severity-medium {
    background: rgba(234, 179, 8, 0.2);
    color: #fde047;
    border: 1px solid rgba(234, 179, 8, 0.4);
  }

  .severity-low {
    background: rgba(34, 197, 94, 0.2);
    color: #86efac;
    border: 1px solid rgba(34, 197, 94, 0.4);
  }

  .finding-fallback {
    background: linear-gradient(145deg, rgba(239, 68, 68, 0.5), rgba(249, 115, 22, 0.45));
    border-bottom: 1px solid var(--surface-border-soft);
  }
</style>
