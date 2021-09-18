import firebase from "firebase";
import {
  USER_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
  USER_POSTS_STATE_CHANGE,
  USERS_DATA_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
} from "../constants";

export function fetchUser() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          dispatch({ type: USER_STATE_CHANGE, user });
        } else {
          console.log("Does not exist");
        }
      });
  };
}

export function fetchUserPosts() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
      .collection("userPosts")
      .orderBy("creation", "asc")
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        dispatch({ type: USER_POSTS_STATE_CHANGE, posts });
      });
  };
}

export function fetchUserFollowing() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .onSnapshot((snapshot) => {
        let following = snapshot.docs.map((doc) => {
          const id = doc.id;
          return id;
        });
        dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following });
        for (let i = 0; i < following; i++) {
          dispatch(fetchUserData(following[i]));
        }
      });
  };
}

export function fetchUserData(uid) {
  return (dispatch, getState) => {
    const found = getState().usersDataState.users.some((el) => el.uid === uid);
    if (!found) {
      return (dispatch) => {
        firebase
          .firestore()
          .collection("users")
          .doc(uid)
          .get()
          .then((snapshot) => {
            if (snapshot.exists) {
              console.log("snap data", snapshot);
              let user = snapshot.data();
              user.uid = snapshot.id;
              dispatch({
                type: USERS_DATA_STATE_CHANGE,
                currentUser: snapshot.data(),
              });
              dispatch(fetchUserFollowingPosts(user.id));
            } else {
              console.log("Does not exist");
            }
          });
      };
    }
  };
}

export function fetchUserFollowingPosts(uid) {
  return (dispatch, getState) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .orderBy("creation", "asc")
      .get()
      .then((snapshot) => {
        const uid = snapshot.query.EP.path.segments[1];
        console.log({ snapshot, uid });
        const user = getState().usersDataState.users.find(
          (el) => el.uid === uid
        );

        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data, user };
        });
        console.log("posts", posts);
        dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid });
        console.log("getUseS", getState());
      });
  };
}
