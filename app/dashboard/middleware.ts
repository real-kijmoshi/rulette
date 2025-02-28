/* eslint-disable @typescript-eslint/no-explicit-any */

// eslint-disable-next-line import/no-anonymous-default-export
export default function ({ store, redirect } : any) {
  if (!store.getters['auth/isAuthenticated']) {
    return redirect('/auth/login')
  }
}