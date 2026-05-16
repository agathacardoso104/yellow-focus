import { doc, getDoc, setDoc, onSnapshot, getDocFromServer } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface AppState {
  tasks: any[];
  habits: any[];
  notes: string;
  user: { name: string; email: string } | null;
}

const COLLECTION_NAME = 'user_data';
const USERS_COLLECTION = 'users';

// Connection Test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

export const syncService = {
  /**
   * Verifica se um usuário existe na nuvem e o retorna
   */
  async findUserLocallyOrCloud(email: string): Promise<any | null> {
    try {
      const userDocRef = doc(db, USERS_COLLECTION, email);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, `${USERS_COLLECTION}/${email}`);
    }
    return null;
  },

  /**
   * Salva um novo usuário na nuvem para permitir login em outros aparelhos
   */
  async registerUserCloud(user: any) {
    try {
      const userDocRef = doc(db, USERS_COLLECTION, user.email);
      await setDoc(userDocRef, user);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `${USERS_COLLECTION}/${user.email}`);
    }
  },

  /**
   * Salva o estado atual no Firestore usando o email do usuário como ID do documento
   */
  async saveState(state: AppState) {
    if (!state.user?.email) return;

    try {
      const userDocRef = doc(db, COLLECTION_NAME, state.user.email);
      await setDoc(userDocRef, {
        tasks: state.tasks,
        habits: state.habits,
        notes: state.notes,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${state.user.email}`);
    }
  },

  /**
   * Carrega o estado inicial do Firestore
   */
  async loadState(email: string): Promise<Partial<AppState> | null> {
    if (!email) return null;

    try {
      const userDocRef = doc(db, COLLECTION_NAME, email);
      const docSnap = await getDoc(userDocRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as Partial<AppState>;
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `${COLLECTION_NAME}/${email}`);
    }
    return null;
  },

  /**
   * Escuta mudanças em tempo real no Firestore (Sincronização entre abas/dispositivos)
   */
  subscribeToChanges(email: string, onUpdate: (data: Partial<AppState>) => void) {
    if (!email) return () => {};

    try {
      const userDocRef = doc(db, COLLECTION_NAME, email);
      return onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          onUpdate(doc.data() as Partial<AppState>);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, `${COLLECTION_NAME}/${email}`);
      });
    } catch (error) {
      console.warn('Erro na configuração do onSnapshot');
      return () => {};
    }
  }
};
