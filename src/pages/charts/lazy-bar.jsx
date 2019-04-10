import React, { Component,  Suspense, lazy } from 'react';

const LazyBar = lazy(() => import('./bar'));

export default class Bar extends Component {
  render() {
    return <Suspense fallback={<div>loading....</div>}>
      <LazyBar />
    </Suspense>
  }
}