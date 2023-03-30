<script setup>
    import { ref } from 'vue';
    import { useExamplesStore } from '../stores/examples';
    import QueryBox from '../components/QueryBox.vue';
    import CodeEditor from '../components/CodeEditor.vue'
    import LinkOutIcon from '../components/LinkOutIcon.vue';

    let store = useExamplesStore();

    let JobURL = ref('');
</script>

<template>
    <div class="min-h-screen container m-auto">
        <div class="w-full px-5 py-7 text-white">
            <RouterLink to="/">Back</RouterLink>
        </div>
        <div class="w-3/4 m-auto my-7">
            <h1 class="text-orange-600 text-3xl">Example Queries</h1>
            <p class="text-white">
                BioThings Explorer allows users to query a vast amount of biological and chemical databases in a central place to answer and predict complex biological questions.
            </p>
        </div>
        <div class="grid sm:grid-cols-1 md:grid-cols-2 gap-2">
            <div>
                <h2 class="text-stone-400 text-left my-4 text-lg">1. Select a query</h2>
                <div class="flex flex-wrap justify-center gap-4">
                    <template v-for="q in store.queries" :key="q.name">
                        <QueryBox class="flex-basis-[400px]" :query="q"></QueryBox>
                    </template>
                </div>
            </div>
            <div>
                <h2 class="text-stone-400 text-left my-4 text-lg">2. Inspect/Edit/Execute your query</h2>
                <p class="text-orange-400 text-left">BTE queries work asynchronously, you will get a <b class="text-green-400">job ID</b>. <span class="text-gray-500">While BTE works on this you can go grab some coffee or go pet your cat!</span></p>
                <div class="w-[100%]">
                    <CodeEditor class="min-h-[20vh] flex-basis-1/2 my-3" :query="store?.selectedQuery?.query"></CodeEditor>
                </div>
            </div>
        </div>
        <h2 class="text-stone-400 text-left mt-4 text-lg">3. Check your results. <span class="text-orange-400">Pick a <b class="text-green-400">job ID</b> and see if BTE is done with your request.</span></h2>
        <p class="text-gray-500">Note: BioThings Explorer keeps your job history for up to a week.</p>
        <div class="min-h-[20vh] flex justify-center gap-3 items-center">
            <div v-if="store.jobs && store.jobs.length">
                <label for="job-select" class="text-orange-400 mr-3">Choose a job ID</label>
                <select v-model="JobURL" name="jobs" id="job-select" class="px-7 py-1 rounded-full bg-orange-500 text-white mr-3">
                    <option value="">Choose one</option>
                    <template v-for="job in store.jobs" :key="job.id">
                        <option :value="job.url">{{ job.id }} {{ job?.description }} - {{ job.date }}</option>
                    </template>
                </select>
            </div>
            <p v-else class="text-center text-gray-400">No jobs have been created yet.</p>
            <a v-if="JobURL" class="main-btn-outline" target="_blank" :href="JobURL" rel="nonopenner">
                Check Results <LinkOutIcon></LinkOutIcon>
            </a>
            <button v-if="store.jobs && store.jobs.length" class="main-btn-outline hover:bg-red-500" @click="store.deleteJobs()">
                Delete All Jobs
            </button>
        </div>
        
    </div>
</template>