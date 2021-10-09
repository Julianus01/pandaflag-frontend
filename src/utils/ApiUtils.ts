const LS_USER_KEY: string = "userId"

function saveUserIdInLS(userId: string) {
  localStorage.setItem(LS_USER_KEY, userId)
}

function removeUserIdFromLS() {
  localStorage.removeItem(LS_USER_KEY)
}

function globalUserId(): string {
  const userId: string = localStorage.getItem(LS_USER_KEY) as string
  return userId
}

const ApiUtils = {
  saveUserIdInLS,
  removeUserIdFromLS,
  globalUserId
}

export default ApiUtils