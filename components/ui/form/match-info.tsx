import { Container } from "../container";
import { Input } from "../input";

export const MatchInfo: React.FC = () => {
  return (
    <div className="grid grid-cols-1 mb-8">
      <Container>
        <select
          id="matchType"
          className="p-2 text-lg leading-tight border rounded shadow focus:outline-none focus:shadow-outline"
        >
          <option>Qualification</option>
          <option>Quarterfinal</option>
          <option>Semifinal</option>
          <option>Final</option>
        </select>
        <Input id="matchNumber" placeholder="Match number" type="number" autoComplete="off" required />
      </Container>
      <Input id="teamNumber" placeholder="Team number" type="number" autoComplete="off" required />
      <Input id="eventName" placeholder="Event name" autoComplete="off" required />
    </div>
  );
};