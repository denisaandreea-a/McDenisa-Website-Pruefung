import { Component } from '@angular/core';

type TeamMember = {
  name: string;
  alias: string;
  role: string;
  image: string;
  station: string;
  favoriteFood: string;
  focusTitle: string;
  focusText: string;
  traits: string[];
  superpower: string;
  funFact?: string;
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
      favoriteFood: 'McCrispy Chicken & Chicken McNuggets',
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
      favoriteFood: 'Greek Style Wrap',
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
    {
      name: 'Apitz',
      alias: 'Süss und Sauer',
      role: 'Schichtführer · Gäste · Team',
      image: '/assets/team/apitz.jpeg',
      station: 'Schichtführung',
      favoriteFood: 'Big Rösti',
      focusTitle: '💬 Meine Stärke',
      focusText:
        'Ich komme sehr gut mit Gästen und Mitarbeitern klar. Wenn jemand ein Problem hat, höre ich zu, versuche die Situation zu verstehen und gemeinsam eine faire Lösung zu finden. Egal ob es um Arbeit oder auch mal um private Themen geht: Ich versuche immer, fair zu bleiben und einen guten Kompromiss zu finden.',
      traits: ['Professionell', 'Freundlich', 'Humorvoll', 'Direkt', 'Kommunikationsstark', 'Lösungsorientiert'],
      superpower: 'Zuhören, verstehen und aus schwierigen Situationen eine faire Lösung machen.',
      funFact: 'Ich habe Ameisen als Haustiere.',
      goal: 'Eine klare, faire und professionelle Schicht führen, in der Gäste und Team gut miteinander klarkommen.',
      motto: 'Klar in der Arbeit, offen im Gespräch.',
      about:
        'Hi, ich bin Apitz. Nach meiner Zeit bei der Bundeswehr habe ich meinen Weg bei McDonald’s gefunden. Zuerst war ich als Mitarbeiter tätig, und seit 2004 arbeite ich als Schichtführer. Bei der Arbeit bin ich klar, zuverlässig und professionell - aber wer mich kennt, weiß, dass ich auch freundlich, humorvoll und immer für ein gutes Gespräch offen bin.',
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
