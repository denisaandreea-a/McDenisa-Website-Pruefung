import { Component } from '@angular/core';

type TeamMember = {
  name: string;
  alias: string;
  role: string;
  image: string;
  station: string;
  focusTitle: string;
  focusText: string;
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
      alias: 'Drive Star',
      role: 'Crew · McDrive',
      image: '/assets/team/othmane.jpeg',
      station: 'McDrive',
      focusTitle: '🍔 Signature Order',
      focusText: 'McCrispy Chicken & Chicken McNuggets',
      traits: ['Locker', 'Positiv', 'Extrovertiert', 'Witzig', 'Ehrgeizig', 'Modebewusst'],
      superpower: 'Schnell bleiben, auch wenn es stressig wird.',
      goal: 'Mich weiterentwickeln, mehr Verantwortung übernehmen und jeden Tag besser werden.',
      motto: 'Gute Laune, Tempo und Teamwork - so läuft der Drive.',
      about:
        'Hi, ich bin Othmane. Ich bin ein positiver, offener und ehrgeiziger Mensch, der gerne gute Stimmung ins Team bringt. Viele unterschätzen mich manchmal, weil ich noch jung wirke - aber spätestens im McDrive zeige ich, wie schnell, konzentriert und zuverlässig ich arbeiten kann.',
      flipped: false,
    },
    {
      name: 'Maria',
      alias: 'Küchenherz',
      role: 'Schichtleiterin · Küche · Team Support',
      image: '/assets/team/maria.jpeg',
      station: 'Küche',
      focusTitle: '🍟 Meine Stärke',
      focusText:
        'Küche ist meine stärkste Station. Dort arbeite ich sicher, schnell und mit Erfahrung. Ich weiß, worauf es ankommt, und versuche, auch anderen Sicherheit zu geben.',
      traits: ['Empathisch', 'Herzlich', 'Hilfsbereit', 'Küchenstark', 'Geduldig', 'Verantwortungsbewusst'],
      superpower: 'In der Küche den Überblick behalten und gleichzeitig für mein Team da sein.',
      goal: 'Mein Team unterstützen, Verantwortung übernehmen und gemeinsam einen guten Schichtablauf schaffen.',
      motto: 'Gemeinsam sind wir stark.',
      about:
        'Hi, ich bin Maria. Seit vielen Jahren bin ich Teil des McDonald’s-Teams und habe besonders lange in der Küche gearbeitet. Dort fühle ich mich sehr wohl, denn ich kenne die Abläufe, bleibe auch in stressigen Momenten ruhig und unterstütze mein Team, wo ich kann. Heute arbeite ich als Schichtleiterin und übernehme meine Aufgaben mit viel Herz und Verantwortung.',
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
