<template>
    <div class="dropdown" ref="dropdownRef">
        <button class="btn btn-outline-light my-2 dropdown-toggle" type="button" @click.prevent="toggleOpen">
            {{ title }}
        </button>
        <ul v-if="isOpen" class="dropdown-menu" :style="{ display: 'block' }">
            <slot></slot>
            <!-- <li><a class="dropdown-item" href="#">Action</a></li>
      <li><a class="dropdown-item" href="#">Another action</a></li>
      <li><a class="dropdown-item" href="#">Something else here</a></li> -->
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import useClickOutside from '@/hooks/useClickOutside';
export default defineComponent({
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Dropdown',

    props: {
        title: {
            type: String,
            required: true,
        },
    },
    setup() {
        const isOpen = ref(false);
        const toggleOpen = () => {
            isOpen.value = !isOpen.value;
        };
        const dropdownRef = ref<null | HTMLElement>(null);
        const isClickOutside = useClickOutside(dropdownRef);
        watch(isClickOutside, () => {
            if (isOpen.value && isClickOutside.value) {
                isOpen.value = false;
            }
        });

        return {
            isOpen,
            toggleOpen,
            dropdownRef,
            isClickOutside,
        };
    },
});
</script>
