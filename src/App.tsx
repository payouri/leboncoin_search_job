import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import './App.css';
import { Affix, Space, Layout, Input, Spin, Button, } from 'antd';
import { IApartment } from './components/AptList'
const AptList = lazy(() => import('./components/AptList'))

const fetchSearch = async () => await fetch('./search.json').then(res => res.json())

const App = () => {
  const [filter, setFilter] = useState<string>('')
  const [apartments, setApartments] = useState<IApartment[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const refreshList = useCallback(async () => {
    setLoading(true)
    const result : IApartment[] = await fetchSearch()
    setApartments(result.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    }))
    setLoading(false)
  }, [])

  useEffect(() => {
    refreshList()
    return () => { }
  }, [refreshList])

  // useEffect(() => {

  // }, [loading, apartments])

  return (
    <div className="App">
      <Layout>
        <Affix>
          <Layout.Header style={{ display: 'flex', alignItems: 'center' }}>
            <Space align="center">
              <Button style={{ marginRight: '.5rem' }} type='primary' onClick={() => { refreshList() }}>Rafraîchir</Button>
            </Space>
            <Input.Search value={filter} onChange={({ target: { value } }) => { setFilter(value) }} enterButton={false} />
          </Layout.Header>
        </Affix>
        <Layout.Content style={{ minHeight: '100vh' }}>
          <Suspense fallback={<Spin size="large" delay={100}  style={{ margin: 'auto' }}/>}>
            <AptList loading={loading} apartments={apartments} textFilter={filter} />
          </Suspense>
        </Layout.Content>
      </Layout>
    </div>
  );
}

export default App;
