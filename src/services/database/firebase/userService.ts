import { db } from "@/config/firebase";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { saltAndHashPassword, verifyPassword } from "@/helpers/password";

export const userService = {
  async syncOAuthUser(userId: string, email: string, username: string) {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        id: userId,
        email,
        username,
        createdAt: new Date().toISOString(),
      });
    }
  },

  async registerCredentialsUser(email: string, password: string, username: string) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new Error("Такой email уже зарегистрирован. Попробуйте другой.");
    }

    const hashedPassword = await saltAndHashPassword(password);

    const newUserRef = doc(collection(db, "users")); 
    const newUserData = {
      id: newUserRef.id,
      email,
      password: hashedPassword,
      username,
      createdAt: new Date().toISOString(),
    };

    await setDoc(newUserRef, newUserData);

    return { id: newUserRef.id, email, name: username };
  },

  async validateCredentialsUser(email: string, password: string) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("Пользователь с таким email не найден.");
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    const isPasswordValid = await verifyPassword(password, userData.password);

    if (!isPasswordValid) {
      throw new Error("Неверный пароль. Пожалуйста, попробуйте еще раз.");
    }

    return { id: userDoc.id, email: userData.email, name: userData.username };
  }
};