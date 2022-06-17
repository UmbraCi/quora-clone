import { ref, onMounted, onUnmounted, Ref } from 'vue';
const useClickOutside = (elementRef: Ref<null | HTMLElement>) => {
    const isClickOutside = ref(false);
    const handler = (e: MouseEvent) => {
        if (elementRef.value && !elementRef.value.contains(e.target as Node)) {
            isClickOutside.value = true;
        } else {
            isClickOutside.value = false;
        }
    };
    onMounted(() => {
        document.addEventListener('click', handler);
    });
    onUnmounted(() => {
        document.removeEventListener('click', handler);
    });
    return isClickOutside;
};

export default useClickOutside;
