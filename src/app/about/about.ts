import { Component } from '@angular/core';

type TeamMember = {
  id: string;
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
  mottoEmoji: string;
  about: string;
  flipped: boolean;
};

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
/* die "Über uns"-Seite mit den Team-Flip-Cards. alle Daten stehen fest in
   teamMembers, für ein neues Teammitglied reicht ein neuer Eintrag, das
   Template baut die Karte dann automatisch draus */
export class About {
  teamMembers: TeamMember[] = [
    {
      id: 'othmane',
      name: 'O.',
      alias: 'Drive Star',
      role: 'Schichtleiter',
      image: '/assets/team/othmane.jpeg',
      favoriteFood: 'McCrispy Chicken & Chicken McNuggets',
      focusTitle: '🚀 Meine Stärke',
      focusText:
        'Ich bringe frischen Schwung und gute Laune in jede Schicht - am Drive bin ich schnell, freundlich und behalte auch in stressigen Momenten den Kopf oben.',
      traits: ['Locker', 'Positiv', 'Extrovertiert', 'Witzig', 'Ehrgeizig', 'Modebewusst'],
      superpower: 'Schnell bleiben, auch wenn es stressig wird.',
      goal: 'Mich weiterentwickeln, mehr Verantwortung übernehmen und jeden Tag besser werden.',
      motto: 'Gute Laune, Tempo und Teamwork - so läuft die Schicht.',
      mottoEmoji: '⚡',
      about:
        'Hi, ich bin O. Ich bin ein positiver, offener und ehrgeiziger Mensch, der gerne gute Stimmung ins Team bringt. Viele unterschätzen mich manchmal, weil ich noch jung wirke - aber ich zeige, wie schnell, konzentriert und zuverlässig ich arbeiten kann.',
      flipped: false,
    },
    {
      id: 'maria',
      name: 'M.',
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
      mottoEmoji: '🤝',
      about:
        'Hi, ich bin M. Seit vielen Jahren bin ich Teil des McDonald’s-Teams und kenne die Abläufe genau. Ich fühle mich an jeder Station wohl, bleibe auch in stressigen Momenten ruhig und unterstütze mein Team, wo ich kann. Heute arbeite ich als Schichtleiterin und übernehme meine Aufgaben mit viel Herz und Verantwortung.',
      flipped: false,
    },
    {
      id: 'apitz',
      name: 'A.',
      alias: 'Süss und Sauer',
      role: 'Schichtleiter',
      image: '/assets/team/apitz.jpeg',
      favoriteFood: 'Big Rösti',
      focusTitle: '💬 Meine Stärke',
      focusText:
        'Ich höre zu, verstehe die Situation und finde gemeinsam mit Gästen und Team eine faire Lösung - egal ob es um Arbeit oder private Themen geht.',
      traits: ['Professionell', 'Freundlich', 'Humorvoll', 'Direkt', 'Kommunikationsstark', 'Lösungsorientiert'],
      superpower: 'Zuhören, verstehen und aus schwierigen Situationen eine faire Lösung machen.',
      funFact: 'Ich habe Ameisen als Haustiere.',
      goal: 'Eine klare, faire und professionelle Schicht führen, in der Gäste und Team gut miteinander klarkommen.',
      motto: 'Klar in der Arbeit, offen im Gespräch.',
      mottoEmoji: '💬',
      about:
        'Hi, ich bin A. Nach meiner Zeit bei der Bundeswehr habe ich meinen Weg bei McDonald’s gefunden - erst als Mitarbeiter, seit 2004 als Schichtleiter. Bei der Arbeit bin ich klar und professionell, aber wer mich kennt, weiß: ich bin auch freundlich, humorvoll und offen für ein gutes Gespräch.',
      flipped: false,
    },
    {
      id: 'grabaz',
      name: 'Frau G.',
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
      mottoEmoji: '🔥',
      about:
        'Hi, ich bin Frau G. Seit der Neueröffnung des McDonald’s in Ahlen im Dezember 1997 bin ich Teil des Teams. Angefangen habe ich damals als Minijobberin, heute arbeite ich seit vielen Jahren als Schichtleiterin. In dieser Zeit habe ich viele Veränderungen, Herausforderungen und besondere Momente erlebt – aber meine Energie und Motivation sind bis heute geblieben.',
      flipped: false,
    },
    {
      id: 'dino',
      name: 'D.',
      alias: 'Mr. Chill',
      role: 'Schichtleiter',
      image: '/assets/team/dino.jpeg',
      favoriteFood: 'Chicken Wings',
      focusTitle: '😌 Meine Stärke',
      focusText:
        'Ich bleibe ruhig und gelassen, egal was passiert. Mich aus der Ruhe zu bringen ist schon eine echte Herausforderung.',
      traits: ['Locker', 'Freundlich', 'Gelassen', 'Lustig', 'Hilfsbereit', 'Geduldig'],
      superpower: 'Auch in stressigen Situationen ruhig bleiben und für gute Stimmung sorgen.',
      funFact: 'Ich sehe manchmal streng aus, bin aber der Lockerste im Team.',
      goal: 'Dafür sorgen, dass die Gäste zufrieden sind und die Schicht entspannt und ohne Stress läuft.',
      motto: 'Arbeit macht Spaß, wenn man sie ohne Stress angeht.',
      mottoEmoji: '😎',
      about:
        'Hi, ich bin D. Seit rund vier Jahren bin ich Teil des McDonald’s-Teams. Auch wenn ich auf den ersten Blick streng oder ernst wirke, bin ich eigentlich sehr locker und leicht zum Lachen zu bringen - mich aus der Ruhe zu bringen ist dagegen schon eine Kunst. Stress und Streit sind nicht mein Ding, ich bleibe lieber freundlich und entspannt. Am wichtigsten ist mir, dass unsere Gäste zufrieden sind.',
      flipped: false,
    },
    {
      id: 'saitinidou',
      name: 'Frau S.',
      alias: 'Mama',
      role: 'Restaurantleiterin',
      image: '/assets/team/saitinidou.jpeg',
      favoriteFood: 'Big Mac',
      focusTitle: '🎯 Meine Stärke',
      focusText:
        'Ich bleibe fokussiert, halte mich an Regeln und sorge dafür, dass der Betrieb reibungslos läuft.',
      traits: ['Professionell', 'Diszipliniert', 'Direkt', 'Fokussiert', 'Konsequent', 'Respektiert'],
      superpower: 'Mit einem Wort dafür sorgen, dass alle sofort wissen, was zu tun ist.',
      goal: 'Einen disziplinierten, gut organisierten Betrieb führen, in dem sich alle an die Regeln halten und aufeinander verlassen können.',
      motto: 'Regeln sind da, damit alles reibungslos läuft.',
      mottoEmoji: '📋',
      about:
        'Hi, ich bin Frau S. Als Restaurantleiterin sorge ich dafür, dass bei uns alles nach Plan läuft. Ich bin professionell, direkt und lege Wert auf klare Regeln und Disziplin. Im Team werde ich liebevoll „Mama“ genannt - auch wenn viele zunächst etwas Respekt vor mir haben, weiß jeder, dass ich es nur gut mit dem Team meine.',
      flipped: false,
    },
    {
      id: 'alina',
      name: 'A.',
      alias: 'Ordnungsqueen',
      role: 'Schichtleiterin',
      image: '/assets/team/alina.jpeg',
      favoriteFood: 'Royal TS',
      focusTitle: '🧹 Meine Stärke',
      focusText:
        'Ordnung und Sauberkeit sind mir extrem wichtig. Ich sorge dafür, dass die Lobby immer top aussieht und alles seinen Platz hat.',
      traits: ['Ordentlich', 'Diszipliniert', 'Planvoll', 'Direkt', 'Lustig', 'Ehrgeizig'],
      superpower: 'Ordnung, Planung und Sauberkeit auch in stressigen Momenten nicht aus den Augen verlieren.',
      goal: 'Mich beruflich weiterentwickeln - deshalb mache ich gerade meine Ausbildung in der Gastronomie neben meiner Arbeit als Schichtleiterin.',
      motto: 'Ordnung ist das halbe Leben - Spaß die andere Hälfte.',
      mottoEmoji: '✨',
      about:
        'Hi, ich bin A. Seit 10 Jahren bin ich Teil des Teams und arbeite mittlerweile als Schichtleiterin. Planung, Sauberkeit und klare Regeln sind mir sehr wichtig - wer meine Anweisungen nicht befolgt, merkt schnell, dass ich es auch streng kann. Aktuell mache ich zusätzlich meine Ausbildung in der Gastronomie, weil mir Weiterentwicklung wichtig ist. Außerhalb der Arbeit bin ich aber ein richtiger Partymensch und liebe es, Spaß zu haben.',
      flipped: false,
    },
  ];

  /* nicht alle Teammitglieder werden angezeigt (visibleTeamOrder entscheidet
     wer und in welcher Reihenfolge), und es wird immer nur teamPageSize
     Personen gleichzeitig gezeigt, dadurch wirkts wie ein Karussell */
  private readonly teamPageSize = 1;
  private readonly visibleTeamOrder = [
    'saitinidou',
    'apitz',
    'grabaz',
    'maria',
    'alina',
    'dino',
    'othmane',
  ];
  activeTeamPage = 0;

  /* teilt die sichtbaren Teammitglieder in "Seiten" auf (bei teamPageSize = 1
     ist das eine Person pro Seite). die Pfeile im Template blättern dann
     einfach zwischen den Einträgen von teamPages durch */
  get teamPages(): TeamMember[][] {
    const visibleTeamMembers = this.visibleTeamOrder
      .map(id => this.teamMembers.find(member => member.id === id))
      .filter((member): member is TeamMember => member !== undefined);
    const pages: TeamMember[][] = [];
    for (let i = 0; i < visibleTeamMembers.length; i += this.teamPageSize) {
      pages.push(visibleTeamMembers.slice(i, i + this.teamPageSize));
    }
    return pages;
  }

  showPreviousTeamPage(): void {
    this.setActiveTeamPage(this.activeTeamPage - 1);
  }

  showNextTeamPage(): void {
    this.setActiveTeamPage(this.activeTeamPage + 1);
  }

  /* blättert zur gewünschten Seite. geht man vor der ersten oder nach der
     letzten Seite weiter, springt man ans jeweils andere Ende (Wrap-Around),
     so kann man quasi endlos im Kreis weiterklicken */
  setActiveTeamPage(index: number): void {
    const lastIndex = this.teamPages.length - 1;

    if (index < 0) {
      this.activeTeamPage = lastIndex;
      return;
    }

    if (index > lastIndex) {
      this.activeTeamPage = 0;
      return;
    }

    this.activeTeamPage = index;
  }

  // Dreht eine einzelne Karte um (Vorderseite <-> Rückseite mit Steckbrief).
  // Jede Karte hat ihr eigenes flipped-Feld, die anderen Karten bleiben also unberührt.
  toggleTeamCard(member: TeamMember): void {
    member.flipped = !member.flipped;
  }

  // Damit man die Karte nicht nur mit der Maus, sondern auch mit der
  // Tastatur (Enter oder Leertaste) umdrehen kann - wichtig für Barrierefreiheit.
  onTeamCardKeydown(event: KeyboardEvent, member: TeamMember): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleTeamCard(member);
    }
  }
}
