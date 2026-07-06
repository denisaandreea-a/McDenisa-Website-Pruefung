import { Component } from '@angular/core';

type TeamMember = {
  name: string;
  alias: string;
  image: string;
  station: string;
  order: string;
  traits: string[];
  superpower: string;
  goal: string;
  motto: string;
  about: string;
  flipped: boolean;
};

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  teamMembers: TeamMember[] = [
    {
      name: 'Othmane',
      alias: 'Drive-Speed-Profi',
      image: '/assets/team/othmane.jpeg',
      station: 'McDrive',
      order: 'McCrispy Chicken & Chicken McNuggets',
      traits: ['Locker', 'Positiv', 'Extrovertiert', 'Witzig', 'Ehrgeizig', 'Modebewusst'],
      superpower: 'Schnell bleiben, auch wenn es stressig wird.',
      goal: 'Mich weiterentwickeln, mehr Verantwortung übernehmen und jeden Tag besser werden.',
      motto: 'Gute Laune, Tempo und Teamwork - so läuft der Drive.',
      about:
        'Hi, ich bin Othmane. Ich bin ein positiver, offener und ehrgeiziger Mensch, der gerne gute Stimmung ins Team bringt. Viele unterschätzen mich manchmal, weil ich noch jung wirke - aber spätestens im McDrive zeige ich, wie schnell, konzentriert und zuverlässig ich arbeiten kann.',
      flipped: false,
    },
  ];

  activeTeamIndex = 0;

  toggleTeamCard(member: TeamMember): void {
    member.flipped = !member.flipped;
  }

  showPreviousTeamMember(): void {
    this.setActiveTeamMember(this.activeTeamIndex - 1);
  }

  showNextTeamMember(): void {
    this.setActiveTeamMember(this.activeTeamIndex + 1);
  }

  setActiveTeamMember(index: number): void {
    const lastIndex = this.teamMembers.length - 1;

    if (index < 0) {
      this.activeTeamIndex = lastIndex;
      return;
    }

    if (index > lastIndex) {
      this.activeTeamIndex = 0;
      return;
    }

    this.activeTeamIndex = index;
  }

  onTeamCardKeydown(event: KeyboardEvent, member: TeamMember): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleTeamCard(member);
    }
  }
}
