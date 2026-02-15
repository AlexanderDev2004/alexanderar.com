<script lang="ts">
  import type { FileItem } from '../data/files';

  let items: FileItem[] = [];

  export { items as items };
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
  {#each items as file (file.id)}
    <div class="border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900 w-full md:max-w-sm lg:max-w-md md:mx-auto">
      <div class="bg-gray-100 dark:bg-gray-800 h-24 md:h-24 overflow-hidden flex items-start justify-center">
        <iframe
          title={`${file.title} preview`}
          src={`${file.fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          class="w-full h-32 md:h-32 scale-100"
          style="border: 0;"
        ></iframe>
      </div>

      <div class="p-4 space-y-3">
        <div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            {file.title}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {file.description}
          </p>
        </div>

        <div class="flex justify-end">
          <a
            href={file.fileUrl}
            download
            class="inline-flex items-center gap-2 px-4 py-2 border border-gray-400 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            {file.buttonLabel}
            <iconify-icon icon="mdi:file-pdf-box" width="18" height="18"></iconify-icon>
          </a>
        </div>
      </div>
    </div>
  {/each}
</div>
