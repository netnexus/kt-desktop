import * as keytar from 'keytar';

const serviceName = 'Kt-Desktop';

export async function getCredentials() {
  const cred: Array<any> = await keytar.findCredentials(serviceName) as any;
  if (cred.length > 0) {
    return cred[0];
  }
  return {account: null};
}

export async function setCredentials(account, password) {
  return keytar.setPassword(serviceName, account, password);
}

export async function clearCredentials() {
  const account = (await getCredentials()).account;
  await keytar.deletePassword(serviceName, account);
}

