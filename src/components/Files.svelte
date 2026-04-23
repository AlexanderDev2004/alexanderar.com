<script lang="ts">
  import type { FileItem } from '../data/files';

  let items: FileItem[] = [];

  export { items as items };
</script>

{#if items.length > 0}
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
    {#each items as file, index (file.id)}
      <div
        class="surface-item rounded-xl overflow-hidden w-full reveal pressable"
        style={`--reveal-delay: ${index}`}
      >
        <div class="h-28 sm:h-32 md:h-32 overflow-hidden flex items-start justify-center" style="background: var(--surface);">
          <iframe
            title={`${file.title} preview`}
            src={`${file.fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            class="w-full h-28 sm:h-32 md:h-32 scale-100"
            style="border: 0;"
          ></iframe>
        </div>

        <div class="p-3 sm:p-4 space-y-3">
          <div>
            <h3 class="text-base sm:text-lg font-bold primary-text">
              {file.title}
            </h3>
            <p class="text-sm muted-text mt-1">
              {file.description}
            </p>
          </div>

          <div class="flex justify-start sm:justify-end">
            <a
              href={file.fileUrl}
              download
              class="file-download-btn w-full sm:w-auto text-sm font-medium primary-text"
            >
              {file.buttonLabel}
              <iconify-icon icon="mdi:file-pdf-box" width="18" height="18"></iconify-icon>
            </a>
          </div>
        </div>
      </div>
    {/each}
  </div>
{:else}
  <div class="text-center py-8">
    <p class="muted-text">Sorry, files are not available.</p>
  </div>
{/if}

<style>
  .file-download-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.52rem 0.9rem;
    border: 1px solid var(--surface-border-soft);
    border-radius: 0.65rem;
    background: var(--surface);
    transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
  }

  .file-download-btn:hover,
  .file-download-btn:focus-visible {
    transform: translateY(-1px);
    border-color: var(--accent);
    background: var(--accent-soft);
  }
</style>
