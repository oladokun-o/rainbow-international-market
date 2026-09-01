<script lang="ts">
  // Embedded Sanity Studio. `SanityStudio` is re-exported by @sanity/sveltekit
  // and takes the Studio `config`.
  import { SanityStudio } from '@sanity/sveltekit';
  import config from '../../../../sanity.config';
</script>

<SanityStudio {config} />
