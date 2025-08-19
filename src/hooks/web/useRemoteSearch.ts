type RemoteSearchHandler = (
  query: string,
  setOptions: (options: any[]) => void,
  setLoading: (loading: boolean) => void,
 ...params: any[]
) => Promise<void>

export function useRemoteSearch(handler: RemoteSearchHandler, paramsSource?) {
  const options = ref<any[]>([])
  const loading = ref(false)

  const handleSearch = async (query: string) => {
    let paramsValues: any[] = []
    paramsSource && (paramsValues = Object.values(paramsSource).map(param => param.value))
    typeof query === 'string' && (query = query.trim())
    
    await handler(
      query,
      (newOptions) => options.value = newOptions,
      (isLoading) => loading.value = isLoading,
      ...paramsValues
    )
  }

  return {
    options,
    loading,
    handleSearch
  }
}
