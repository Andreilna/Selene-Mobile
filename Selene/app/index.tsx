import { Redirect } from 'expo-router';

export default function Index() {
  // Isso força o app a pular para dentro da pasta (auth)
  return <Redirect href="/(auth)/" />;
}