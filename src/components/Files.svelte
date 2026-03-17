<script lang="ts">
  import type { FileItem } from '../data/files';

  let items: FileItem[] = [];

  export { items as items };
</script>

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
            class="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 border rounded-lg transition-colors text-sm font-medium primary-text"
            style="border-color: var(--surface-border); background: var(--surface);"
          >
            {file.buttonLabel}
            <iconify-icon icon="mdi:file-pdf-box" width="18" height="18"></iconify-icon>
          </a>
        </div>
      </div>
    </div>
  {/each}
</div>
