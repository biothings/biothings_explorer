<script setup>
    import CytoNetwork from './CytoNetwork.vue';
    import { useExamplesStore } from '../stores/examples';

    let store = useExamplesStore();
    const props = defineProps(['query'])

</script>

<template>
    <div class="rounded bg-gradient-to-b from-gray-800 outline outline-4 hover:outline-orange-500
     text-white p-2 text-center cursor-pointer"
     data-tippy-content="Click to select"
     @click="store.select(props.query.id)" 
     :class="[props.query.selected ? 'outline-white from-purple-800 to-blue-600' : 'outline-stone-600 to-teal-800']">
       <small class="text-yellow-400">"{{ props.query.name }}"</small>
        <CytoNetwork :query="props.query"></CytoNetwork>
    </div>
</template>