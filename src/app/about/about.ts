import { Component } from '@angular/core';

type TeamMember = {
  name: string;
  alias: string;
  role: string;
  image: string;
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
      role: 'Schichtleiter',
      image: '/assets/team/othmane.jpeg',
      favoriteFood: 'McCrispy Chicken & Chicken McNuggets',
      focusTitle: '🍔 Signature Order',
      focusText: 'McCrispy Chicken & Chicken McNuggets',
      traits: ['Locker', 'Positiv', 'Extrovertiert', 'Witzig', 'Ehrgeizig', 'Modebewusst'],
      superpower: 'Schnell bleiben, auch wenn es stressig wird.',
      goal: 'Mich weiterentwickeln, mehr Verantwortung übernehmen und jeden Tag besser werden.',
      motto: 'Gute Laune, Tempo und Teamwork - so läuft die Schicht.',
      about:
        'Hi, ich bin Othmane. Ich bin ein positiver, offener und ehrgeiziger Mensch, der gerne gute Stimmung ins Team bringt. Viele unterschätzen mich manchmal, weil ich noch jung wirke - aber ich zeige, wie schnell, konzentriert und zuverlässig ich arbeiten kann.',
      flipped: false,
    },
    {
      name: 'Maria',
      alias: 'Küchenherz',
      role: 'Schichtleiterin',
      image: '/assets/team/maria.jpeg',
      favoriteFood: 'Greek Style Wrap',
      focusTitle: '🍟 Meine Stärke',
      focusText:
        'Ich arbeite sicher, schnell und mit Erfahrung. Ich weiß, worauf es ankommt, und versuche, auch anderen Sicherheit zu geben.',
      traits: ['Empathisch', 'Herzlich', 'Hilfsbereit', 'Belastbar', 'Geduldig', 'Verantwortungsbewusst'],
      superpower: 'In stressigen Situationen den Überblick behalten und gleichzeitig für mein Team da sein.',
      goal: 'Mein Team unterstützen, Verantwortung übernehmen und gemeinsam einen guten Schichtablauf schaffen.',
      motto: 'Gemeinsam sind wir stark.',
      about:
        'Hi, ich bin Maria. Seit vielen Jahren bin ich Teil des McDonald’s-Teams und kenne die Abläufe genau. Ich fühle mich an jeder Station wohl, bleibe auch in stressigen Momenten ruhig und unterstütze mein Team, wo ich kann. Heute arbeite ich als Schichtleiterin und übernehme meine Aufgaben mit viel Herz und Verantwortung.',
      flipped: false,
    },
    {
      name: 'Apitz',
      alias: 'Süss und Sauer',
      role: 'Schichtleiter',
      image: '/assets/team/apitz.jpeg',
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
        'Hi, ich bin Apitz. Nach meiner Zeit bei der Bundeswehr habe ich meinen Weg bei McDonald’s gefunden. Zuerst war ich als Mitarbeiter tätig, und seit 2004 arbeite ich als Schichtleiter. Bei der Arbeit bin ich klar, zuverlässig und professionell - aber wer mich kennt, weiß, dass ich auch freundlich, humorvoll und immer für ein gutes Gespräch offen bin.',
      flipped: false,
    },
    {
      name: 'Frau Grabaz',
      alias: 'Vollgas seit 1997',
      role: 'Schichtleiterin',
      image: '/assets/team/grabaz.jpeg',
      favoriteFood: 'Kaffee, RedBull Blueberry',
      focusTitle: '💪 Meine Stärke',
      focusText:
        'Ich bin schnell, aktiv und kann mehrere Dinge gleichzeitig erledigen. Auch in hektischen Momenten behalte ich den Überblick und sorge dafür, dass die Schicht läuft.',
      traits: ['Modern', 'Dynamisch', 'Schnell', 'Aktiv', 'Abenteuerlustig', 'Erfahrungsvoll'],
      superpower: 'Seit 1997 mit Energie, Erfahrung und Tempo jede Schicht meistern.',
      goal: 'Ich liebe Abenteuer, neue Erlebnisse und alles, was das Leben spannend macht. Genau diese Energie bringe ich auch mit ins Team.',
      motto: 'Energie kennt kein Alter.',
      about:
        'Hi, ich bin Frau Grabaz. Seit der Neueröffnung des McDonald’s in Ahlen im Dezember 1997 bin ich Teil des Teams. Angefangen habe ich damals als Minijobberin, heute arbeite ich seit vielen Jahren als Schichtleiterin. In dieser Zeit habe ich viele Veränderungen, Herausforderungen und besondere Momente erlebt – aber meine Energie und Motivation sind bis heute geblieben.',
      flipped: false,
    },
  ];

  toggleTeamCard(member: TeamMember): void {
    member.flipped = !member.flipped;
  }

  onTeamCardKeydown(event: KeyboardEvent, member: TeamMember): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleTeamCard(member);
    }
  }
}
