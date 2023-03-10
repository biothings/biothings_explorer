<script setup>
  import LinkOut from './LinkOutIcon.vue'
</script>

<template>
<header>
    <div class="text-white p-2">
      <nav class="flex justify-center items-center space-x-5">
        <a class="link" target="_blank" rel="nonopenner" href="https://smart-api.info/ui/dc91716f44207d2e1287c727f281d339">Docs <LinkOut></LinkOut></a>
        <RouterLink class="link" to="/about">About</RouterLink>
        <a class="link" target="_blank" rel="nonopenner" href="https://github.com/biothings/BioThings_Explorer_TRAPI">GitHub <LinkOut></LinkOut></a>
      </nav>
    </div>
</header>
</template>
