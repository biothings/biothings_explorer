<template>
    <div>
        <div id="CM2" class="bg-white"></div>
        <div class="flex justify-center items-center p-5"> 
            <button class="main-btn-outline" @click="grabLatestEdit()">
                <Logo class="w-8 m-auto inline mr-2"></Logo> GO
            </button>
        </div>
        <p class="text-green-500">{{ store.message }}</p>
    </div>
</template>

<script setup>
import { watch, onMounted } from 'vue';
import { basicSetup, EditorView } from "codemirror";
import { EditorState, Compartment } from "@codemirror/state";
import { json } from "@codemirror/lang-json";
import { autocompletion } from "@codemirror/autocomplete";
import {
defaultHighlightStyle,
syntaxHighlighting,
} from "@codemirror/language";
import { history } from "@codemirror/commands";
import { useExamplesStore } from '../stores/examples';
import Logo from './Logo.vue'

let store = useExamplesStore();

let props = defineProps({
    'query':{
        'default': {}
    }
});

let language = new Compartment(),
    tabSize = new Compartment();

let editor = null;

function render(){
    let state = EditorState.create({
        doc: JSON.stringify(props.query, null, 2),
        extensions: [
        basicSetup,
        history(),
        autocompletion(),
        language.of(json()),
        tabSize.of(EditorState.tabSize.of(8)),
        syntaxHighlighting(defaultHighlightStyle),
        ],
    });
    editor = new EditorView({
        state,
        parent: document.body.querySelector("#CM2"),
    });
}

function grabLatestEdit(){
    store.sendRequest(editor.state.doc.toString())
}

onMounted(()=>{
    render();
    store.getJobs();
});


watch(()=> props.query, (v)=>{
    editor.dispatch({changes: {from: 0, to: editor.state.doc.length, insert: JSON.stringify(v, null, 2)}});
})
</script>