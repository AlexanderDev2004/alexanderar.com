<script>
  export let items = [];
  
  let expandedIndex = -1;
  
  function toggleExpand(index) {
    if (expandedIndex === index) {
      expandedIndex = -1;
    } else {
      expandedIndex = index;
    }
  }

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

<div class="space-y-4">
  {#if items.length > 0}
    {#each items.slice(0, 3) as finding, index (finding.id)}
      <div
        class="surface-item rounded-lg transition-colors overflow-hidden reveal"
        style={`--reveal-delay: ${index}`}
      >
        <button
          type="button"
          onclick={(e) => { e.preventDefault(); toggleExpand(index); }}
          class="w-full text-left p-5 flex justify-between items-start gap-4 hover:bg-opacity-50 cursor-pointer pressable"
        >
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-2 flex-wrap">
              <span class="severity-badge {severityColor(finding.severity)} text-xs font-bold px-2.5 py-0.5 rounded">
                {finding.severity}
              </span>
              <h3 
                class="text-lg font-bold primary-text"
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700;"
              >
                {finding.title}
              </h3>
            </div>
            
            <div class="flex items-center gap-3 mb-2 flex-wrap">
              <span class="pill-chip text-xs font-semibold px-2.5 py-0.5">
                {finding.date}
              </span>
              <span class="pill-chip text-xs font-semibold px-2.5 py-0.5">
                {finding.cwe}
              </span>
              <span class="pill-chip text-xs font-semibold px-2.5 py-0.5">
                {finding.owasp}
              </span>
            </div>

            <p class="text-sm muted-text line-clamp-2" style="font-family: 'Plus Jakarta Sans', sans-serif;">
              {finding.summary}
            </p>
          </div>

          <div class="flex items-center">
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
          <div class="px-5 pb-5 space-y-4 expand-reveal" style="border-top: 1px solid var(--surface-border);">
            <div>
              <p class="text-sm primary-text leading-relaxed">
                {finding.summary}
              </p>
            </div>

            <div class="finding-detail-grid">
              <div class="finding-detail-item">
                <span class="finding-detail-label">Affected URL</span>
                <span class="finding-detail-value font-mono text-xs break-all">{finding.affectedUrl}</span>
              </div>
              <div class="finding-detail-item">
                <span class="finding-detail-label">Classification</span>
                <span class="finding-detail-value">{finding.cwe} &middot; {finding.owasp}</span>
              </div>
            </div>

            {#if finding.tags && finding.tags.length > 0}
              <div class="flex flex-wrap gap-2">
                {#each finding.tags as tag}
                  <span class="pill-chip px-3 py-1 text-xs font-medium">
                    {tag}
                  </span>
                {/each}
              </div>
            {/if}

            {#if finding.reportLink}
              <div>
                <a 
                  href={finding.reportLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="cert-action cert-action--primary text-sm font-medium"
                  onclick={(e) => e.stopPropagation()}
                >
                  <span>View Full Report</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    {/each}

    {#if items.length > 3}
      <div class="flex justify-center pt-4">
        <a 
          href="/all-security-findings"
          class="see-more-btn"
          aria-label="See more security findings"
        >
          <span>See More</span>
          <svg class="see-more-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    {/if}
  {:else}
    <div class="text-center py-8">
      <p class="muted-text">No security findings yet.</p>
    </div>
  {/if}
</div>

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

  .finding-detail-grid {
    display: grid;
    gap: 0.75rem;
  }

  .finding-detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .finding-detail-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .finding-detail-value {
    color: var(--text-primary);
    font-size: 0.875rem;
  }

  .cert-action {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.52rem 0.9rem;
    border: 1px solid var(--surface-border-soft);
    border-radius: 0.68rem;
    background: var(--surface);
    color: var(--text-primary);
    transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
  }

  .cert-action:hover,
  .cert-action:focus-visible {
    transform: translateY(-1px);
    border-color: var(--surface-border);
    background: var(--surface-elevated);
  }

  .cert-action--primary {
    border-color: var(--accent);
    color: var(--accent-strong);
    background: var(--accent-soft);
  }

  .cert-action--primary:hover,
  .cert-action--primary:focus-visible {
    border-color: var(--accent-strong);
    background: var(--accent-soft-strong);
    color: var(--text-primary);
  }
</style>
