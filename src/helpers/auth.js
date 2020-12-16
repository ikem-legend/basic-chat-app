import {auth} from "../services/firebase"
import log from "loglevel"

export function signup(userName, setErrorCb) {
  const email = `${userName}`
  const password = "Pass123$@chatapp.com"
  return auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
      const user = auth().currentUser
      log.warn(user)
      user.updateProfile({displayName: userName})
        .then(() => {
          log.warn('Username updated successfully')
          localStorage.setItem('chatUserName', userName)
        })
        .catch((err) => {
          log.warn(err)
        })
    })
    .catch((error) => {
      const {code, message} = error
      log.warn(code, message)
      setErrorCb(message)
    })
}

export function login(userName, setErrorCb) {
  const email = `${userName}@chatapp.com`
  const password = "Pass123$"
  // return auth().signInAnonymously()
  return auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      localStorage.setItem('chatUserName', userName)
    })
    .catch((error) => {
      const {code, message} = error
      log.warn(code, message)
      setErrorCb(message)
    })
}

export function logout() {
  return auth().signOut()
}