/**
 * 常用的Composition API函数
 */

// 表格相关
export function useTable() {
  const loading = ref(false)
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0
  })

  const handlePageChange = (page: number) => {
    pagination.page = page
  }

  const handlePageSizeChange = (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
  }

  return {
    loading,
    pagination,
    handlePageChange,
    handlePageSizeChange
  }
}

// 表单相关
export function useForm<T extends Record<string, any>>(initialValues: T) {
  const form = reactive<T>({ ...initialValues })
  const formRef = ref()
  
  const resetForm = () => {
    Object.assign(form, initialValues)
    formRef.value?.resetFields()
  }

  const validateForm = () => {
    return formRef.value?.validate()
  }

  return {
    form,
    formRef,
    resetForm,
    validateForm
  }
}

// 搜索相关
export function useSearch<T extends Record<string, any>>(initialParams: T) {
  const searchParams = reactive<T>({ ...initialParams })
  const loading = ref(false)

  const resetSearch = () => {
    Object.assign(searchParams, initialParams)
  }

  return {
    searchParams,
    loading,
    resetSearch
  }
}

// 弹窗相关
export function useDialog() {
  const visible = ref(false)
  
  const openDialog = () => {
    visible.value = true
  }
  
  const closeDialog = () => {
    visible.value = false
  }
  
  return {
    visible,
    openDialog,
    closeDialog
  }
}

// 加载状态相关
export function useLoading() {
  const loading = ref(false)
  
  const withLoading = async <T>(fn: () => Promise<T>): Promise<T> => {
    loading.value = true
    try {
      return await fn()
    } finally {
      loading.value = false
    }
  }
  
  return {
    loading,
    withLoading
  }
}

// 防抖相关
export function useDebounce(fn: Function, delay: number = 300) {
  let timeoutId: number | null = null
  
  const debouncedFn = (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = window.setTimeout(() => {
      fn(...args)
    }, delay)
  }
  
  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }
  
  return {
    debouncedFn,
    cancel
  }
}

// 节流相关
export function useThrottle(fn: Function, delay: number = 300) {
  let lastExecTime = 0
  
  const throttledFn = (...args: any[]) => {
    const now = Date.now()
    if (now - lastExecTime >= delay) {
      fn(...args)
      lastExecTime = now
    }
  }
  
  return throttledFn
}

// 本地存储相关
export function useLocalStorage<T>(key: string, initialValue: T) {
  const storedValue = localStorage.getItem(key)
  const data = ref<T>(
    storedValue ? JSON.parse(storedValue) : initialValue
  )
  
  const setData = (value: T) => {
    data.value = value
    localStorage.setItem(key, JSON.stringify(value))
  }
  
  return [data, setData] as const
}

// 响应式断点
export function useBreakpoint() {
  const breakpoints = {
    xs: 480,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600
  }
  
  const width = ref(window.innerWidth)
  
  const updateWidth = () => {
    width.value = window.innerWidth
  }
  
  onMounted(() => {
    window.addEventListener('resize', updateWidth)
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', updateWidth)
  })
  
  const isXs = computed(() => width.value < breakpoints.sm)
  const isSm = computed(() => width.value >= breakpoints.sm && width.value < breakpoints.md)
  const isMd = computed(() => width.value >= breakpoints.md && width.value < breakpoints.lg)
  const isLg = computed(() => width.value >= breakpoints.lg && width.value < breakpoints.xl)
  const isXl = computed(() => width.value >= breakpoints.xl && width.value < breakpoints.xxl)
  const isXxl = computed(() => width.value >= breakpoints.xxl)
  
  return {
    width,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    isXxl
  }
}