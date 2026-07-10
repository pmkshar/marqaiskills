import { getAllSkills } from '../lib/skills';
import HomeClient from './HomeClient';

export default function Home() {
  const allSkills = getAllSkills();
  return <HomeClient skills={allSkills} />;
}
