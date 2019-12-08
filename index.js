const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const testHtml = `
<div class="aqcResponse">
  <table>
    <tbody>
      <tr>
        <td colspan="2">
          <span class="headerTitle"
            >New Zealand<br />
            Aeronautical Information Services<br />
            ID: NZCH191206009794<br
          /></span>
        </td>
      </tr>
      <tr>
        <td>
          <span class="headerLabel"
            >Pre-flight<br />
            Information Bulletin<br /></span
          ><span class="headerValue">AREA</span>
        </td>
        <td style="text-align: left;vertical-align: text-top">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span class="headerLabel"
            >Period (UTC)<br />
            FROM:&nbsp;</span
          ><span class="headerValue">06 DEC 2019 22:41</span><br /><span
            class="headerLabel"
            >TO:</span
          >
          &nbsp; <span class="headerValue">07 DEC 2019 21:10</span>
        </td>
      </tr>
      <tr>
        <td style="text-align: left">
          <span class="headerLabel">Flight Rules: </span
          ><span class="headerValue">IFR/VFR</span>
        </td>
        <td rowspan="2" style="vertical-align: text-top">
          <span class="headerLabel"
            >Height Limits:<br />
            Lower: </span
          ><span class="headerValue">000</span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span class="headerLabel">Upper: </span
          ><span class="headerValue">999</span>
        </td>
      </tr>
      <tr>
        <td style="text-align: left">
          <span class="headerLabel">Issued: </span
          ><span class="headerValue">06 DEC 2019 22:41 UTC</span>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="text-align: left">
          <span class="headerLabel">Contents: </span
          ><span class="headerValue"
            >NOTAM, ATIS, METAR, TAF,
            <span class="headerValue"
              >SIGMET, VOLCANIC SIGMET, CYCLONE SIGMET</span
            ></span
          ><span class="headerValue">, </span
          ><span class="headerValue">AAW</span>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="text-align: left">
          <span class="headerLabel">Briefing Areas: </span
          ><span class="headerValue"
            >NZ01 NZ02 NZ03 NZ04 NZ05 NZ06 NZ07 NZ08 NZ09 NZ10&nbsp;
          </span>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="text-align: left">
          <span class="headerLabel">Aerodromes: </span
          ><span class="headerValue"
            >NZKT NZKK NZKO NZWR NZDA NZRW NZOX NZKD NZGB NZSL NZOF NZKF NZPI
            NZNE NZWP NZCX NZKE NZWT NZAW NZAA NZUN NZAR NZTH NZME NZPU NZWV
            NZTG NZMA NZTE NZRA NZHN NZWK NZOP NZRO NZRL NZES NZTO NZTT NZGA
            NZGS NZCG NZLT NZAP NZTM NZRK NZTN NZWO NZNP NZNF NZSD NZNR NZHA
            NZHS NZVR NZKY NZFL NZWU NZYP NZOH NZDV NZFI NZPO NZPM NZFP NZKP
            NZOT NZTK NZPP NZMS NZPW NZMK NZKM NZFT NZSO NZNS NZWN NZPN NZCL
            NZWB NZOM NZWS NZLE NZMR NZKI NZGM NZHP NZHK NZLA NZRT NZFE NZML
            NZFJ NZWY NZSF NZFF NZFO NZWL NZCH NZPH NZMC NZHT NZAS NZGT NZTL
            NZRI NZMW NZUK NZTU NZMJ NZOA NZMF NZWF NZWM NZGY NZOU NZCW NZQN
            NZCS NZLX NZRX NZMO NZTI NZDN NZVL NZCB NZGC NZBA NZNV NZRC&nbsp;
          </span>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="text-align: left">
          <span class="headerLabel">MET Locations: </span
          ><span class="headerValue"
            >NZKK NZWR NZWP NZAA NZTG NZHN NZWK NZRO NZGS NZAP NZNP NZNR NZWU
            NZOH NZPM NZPP NZMS NZNS NZWN NZWB NZWS NZHK NZCH NZTU NZMF NZWF
            NZOU NZQN NZMO NZDN NZNV NZZC
          </span>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="text-align: left">
          <span class="headerLabel">AAW Locations: </span
          ><span class="headerValue"
            >FN TA TK ED CP MH SA DV ST TN WW KA AL PL CY GE FD</span
          >
        </td>
      </tr>
    </tbody>
  </table>
  <br /><br /><br /><span class="notamSectionHeader"> AERODROMES </span
  ><br /><br />
  
  <span class="notamLocation">NZKT (KAITAIA) </span
  ><br /><br /><span class="notamSeries">A3723/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;06 DEC 2019
    03:00&nbsp;&nbsp;TO:&nbsp;&nbsp;14 DEC 2019 04:00&nbsp; <br /></span
  ><span class="notamText"
    >DTHR&nbsp;GRVL&nbsp;RWY&nbsp;18&nbsp;DISPLACED&nbsp;A&nbsp;FURTHER&nbsp;200M,&nbsp;MARKED&nbsp;BY&nbsp;THR&nbsp;MARKERS.&nbsp;<br />
    EFFECTIVE&nbsp;OPR&nbsp;LENGTH&nbsp;900M<br /><br /></span
  >
  <span class="notamSeries">A3781/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;06 DEC 2019
    21:25&nbsp;&nbsp;TO:&nbsp;&nbsp;13 DEC 2019 03:30&nbsp; EST<br /></span
  ><span class="notamText"
    >AD&nbsp;HAYMAKING&nbsp;INPR,&nbsp;PERSONNEL&nbsp;AND&nbsp;EQPT&nbsp;OPR<br /><br /></span
  >
  
  <span class="notamLocation">NZWR (WHANGAREI) </span><br /><br /><span
    class="notamSeries"
    >A0172/17</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;30 JAN 2017
    20:49&nbsp;&nbsp;TO:&nbsp;&nbsp;PERM<br /></span
  ><span class="notamText"
    >REF&nbsp;AIP&nbsp;NZWR&nbsp;AD&nbsp;2-52.1&nbsp;WHANGAREI&nbsp;OPERATIONAL&nbsp;DATA&nbsp;(1)<br />
    IFR&nbsp;TAKE-OFF&nbsp;MINIMA&nbsp;TABLE&nbsp;IS&nbsp;AMENDED&nbsp;TO&nbsp;READ&nbsp;AS&nbsp;FLW:<br />
    RWY&nbsp;06/24&nbsp;NIGHT<br />
    AVAILABLE&nbsp;TO&nbsp;OPERATORS&nbsp;AUTHORISED&nbsp;BY&nbsp;CAA&nbsp;NZ&nbsp;ONLY.<br />
    THE&nbsp;FOLLOWING&nbsp;INSTRUMENT&nbsp;DEPARTURE&nbsp;PROCEDURES&nbsp;MAY&nbsp;BE&nbsp;FLOWN&nbsp;AT&nbsp;NIGHT<br />
    BY&nbsp;CAA&nbsp;NZ&nbsp;APPROVED&nbsp;OPERATORS&nbsp;ONLY:<br />
    WHANGAREI&nbsp;SID&nbsp;RWY&nbsp;06&nbsp;BREAM&nbsp;FOUR&nbsp;DEPARTURE&nbsp;(BREAM4)<br />
    WHANGAREI&nbsp;SID&nbsp;RWY&nbsp;06&nbsp;WAIPU&nbsp;TWO&nbsp;DEPARTURE&nbsp;(WAIPU2)<br />
    WHANGAREI&nbsp;SID&nbsp;RWY&nbsp;24&nbsp;HARBOUR&nbsp;FOUR&nbsp;DEPARTURE&nbsp;(HARBOUR4)<br />
    WHANGAREI&nbsp;SID&nbsp;RWY&nbsp;24&nbsp;PORTLAND&nbsp;TWO&nbsp;DEPARTURE&nbsp;(PORTLAND2)<br />
    AIP&nbsp;WILL&nbsp;BE&nbsp;AMENDED<br /><br /></span

  >
  
  <span class="notamLocation">NZGB (GREAT BARRIER) </span><br /><br /><span
    class="notamSeries"
    >A3772/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;06 DEC 2019
    03:01&nbsp;&nbsp;TO:&nbsp;&nbsp;08 DEC 2019 07:30&nbsp; <br /></span
  ><span class="notamText"
    >SEALED&nbsp;TWY&nbsp;AND&nbsp;APRON&nbsp;CLSD&nbsp;DUE&nbsp;WIP,&nbsp;PERSONNEL&nbsp;AND&nbsp;EQPT&nbsp;OPR<br /><br /></span
  ><span class="notamSeries">A3773/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;06 DEC 2019
    03:03&nbsp;&nbsp;TO:&nbsp;&nbsp;08 DEC 2019 07:30&nbsp; <br /></span
  ><span class="notamText"
    >GRASS&nbsp;RWY&nbsp;06/24&nbsp;CLSD&nbsp;DUE&nbsp;WIP<br /><br /></span
  >
  
  <span class="notamLocation">NZKF (KAIPARA FLATS) </span><br /><br /><span
    class="notamSeries"
    >A3495/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;18 NOV 2019
    00:46&nbsp;&nbsp;TO:&nbsp;&nbsp;18 DEC 2019 00:00&nbsp; EST<br /></span
  ><span class="notamText"
    >DTHR&nbsp;GRASS&nbsp;RWY&nbsp;25&nbsp;DISPLACED&nbsp;A&nbsp;FURTHER&nbsp;135M&nbsp;DUE&nbsp;TREES.&nbsp;DTHR&nbsp;MARKED&nbsp;<br />
    BY&nbsp;WHITE&nbsp;TYRES<br /><br /></span
  ><span class="notamSeries">A3751/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;04 DEC 2019
    23:21&nbsp;&nbsp;TO:&nbsp;&nbsp;03 MAR 2020 23:00&nbsp; EST<br /></span
  ><span class="notamText"
    >AD&nbsp;WIP.&nbsp;MEN&nbsp;AND&nbsp;EQPT&nbsp;OPR<br /><br /></span
  >
  
  <span class="notamLocation">NZNE (NORTH SHORE) </span><br /><br /><span
    class="notamSeries"
    >A3686/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;29 NOV 2019
    20:25&nbsp;&nbsp;TO:&nbsp;&nbsp;28 FEB 2020 00:00&nbsp; EST<br /></span
  ><span class="notamText"
    >GRASS&nbsp;PORTION&nbsp;CONCRETE/GRASS&nbsp;RWY&nbsp;03/21&nbsp;RESTRICTED&nbsp;TO&nbsp;ACFT&nbsp;<br />
    MAXIMUM&nbsp;ALL-UP&nbsp;WEIGHT&nbsp;1500KG&nbsp;OR&nbsp;LESS<br /><br /></span
  ><span class="notamSeries">A3687/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;29 NOV 2019
    20:28&nbsp;&nbsp;TO:&nbsp;&nbsp;28 FEB 2020 00:00&nbsp; EST<br /></span
  ><span class="notamText"
    >GRASS&nbsp;PORTION&nbsp;GRVL/GRASS&nbsp;RWY&nbsp;09/27&nbsp;CLSD&nbsp;DUE&nbsp;SFC&nbsp;COND<br /><br /></span
  ><span class="notamLocation">NZWP (WHENUAPAI) </span><br /><br /><span
    class="notamSeries"
    >B6693/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;15 NOV 2019
    04:20&nbsp;&nbsp;TO:&nbsp;&nbsp;14 FEB 2020 04:00&nbsp; EST<br /></span
  ><span class="notamText"
    >CRANE&nbsp;OPR&nbsp;IN&nbsp;VCY&nbsp;36&nbsp;41&nbsp;09.9&nbsp;S&nbsp;174&nbsp;44&nbsp;25.4&nbsp;E&nbsp;(LONG&nbsp;BAY,&nbsp;<br />
    APRX&nbsp;7.8NM&nbsp;NE&nbsp;NZWP&nbsp;AND&nbsp;4.3NM&nbsp;SE&nbsp;NZNE).&nbsp;MAX&nbsp;HGT&nbsp;292FT&nbsp;AGL<br /><br /></span
  ><span class="notamSeries">B6201/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;22 OCT 2019
    20:15&nbsp;&nbsp;TO:&nbsp;&nbsp;22 JAN 2020 01:00&nbsp; EST<br /></span
  ><span class="notamText"
    >CRANE&nbsp;OPR&nbsp;AT&nbsp;36&nbsp;42&nbsp;50.76&nbsp;S&nbsp;174&nbsp;44&nbsp;32.64&nbsp;E&nbsp;(BROWNS&nbsp;BAY)&nbsp;APRX<br />
    6.6NM&nbsp;NE&nbsp;OF&nbsp;THR&nbsp;RWY&nbsp;21.&nbsp;MAX&nbsp;HGT&nbsp;262FT&nbsp;AGL<br /><br /></span
  ><span class="notamSeries">B5383/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;11 SEP 2019
    04:34&nbsp;&nbsp;TO:&nbsp;&nbsp;PERM<br /></span
  ><span class="notamText"
    >REF&nbsp;AIP<br />
    NZWP&nbsp;AD&nbsp;2-33.1&nbsp;RNAV&nbsp;STAR&nbsp;RWY&nbsp;03&nbsp;(1)&nbsp;EFFECTIVE&nbsp;23&nbsp;MAY&nbsp;19<br />
    NZWP&nbsp;AD&nbsp;2-33.2&nbsp;RNAV&nbsp;STAR&nbsp;RWY&nbsp;03&nbsp;(2)&nbsp;EFFECTIVE&nbsp;23&nbsp;MAY&nbsp;19<br />
    NZWP&nbsp;AD&nbsp;2-33.3&nbsp;RNAV&nbsp;STAR&nbsp;RWY&nbsp;21&nbsp;(1)&nbsp;EFFECTIVE&nbsp;23&nbsp;MAY&nbsp;19<br />
    NZWP&nbsp;AD&nbsp;2-33.4&nbsp;RNAV&nbsp;STAR&nbsp;RWY&nbsp;21&nbsp;(2)&nbsp;EFFECTIVE&nbsp;23&nbsp;MAY&nbsp;19<br />
    <br />
    ARRIVALS&nbsp;BOX&nbsp;TO&nbsp;BE&nbsp;ADDED&nbsp;TO&nbsp;THE&nbsp;ABOVE&nbsp;PAGES&nbsp;WITH&nbsp;THE&nbsp;FOLLOWING<br />
    INFORMATION:<br />
    <br />
    ALL&nbsp;ARRIVALS&nbsp;WILL&nbsp;BE&nbsp;ISSUED&nbsp;INSTRUCTIONS&nbsp;TO&nbsp;JOIN&nbsp;THE&nbsp;STAR&nbsp;BY&nbsp;ATC<br /><br /></span

  ><span class="notamSeries">B5384/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;11 SEP 2019
    04:48&nbsp;&nbsp;TO:&nbsp;&nbsp;PERM<br /></span
  ><span class="notamText"
    >REF&nbsp;AIP<br />
    NZWP&nbsp;AD&nbsp;2-62.3&nbsp;RNAV&nbsp;SID&nbsp;RWY&nbsp;03&nbsp;EFFECTIVE&nbsp;23&nbsp;MAY&nbsp;19<br />
    NZWP&nbsp;AD&nbsp;2-62.4&nbsp;RNAV&nbsp;SID&nbsp;RWY&nbsp;21&nbsp;EFFECTIVE&nbsp;23&nbsp;MAY&nbsp;19<br />
    <br />
    UNDER&nbsp;HEADING:&nbsp;ALL&nbsp;DEPARTURES<br />
    ADD&nbsp;BULLET&nbsp;POINT&nbsp;3:<br />
    FOR&nbsp;AIRCRAFT&nbsp;ENTERING&nbsp;THE&nbsp;AUCKLAND&nbsp;OCEANIC&nbsp;FIR&nbsp;11000FT&nbsp;OR&nbsp;ABOVE<br />
    REFER&nbsp;OCEANIC&nbsp;TRANSITION&nbsp;ON&nbsp;DEPARTURE&nbsp;PAGE<br /><br /></span

  ><span class="notamSeries">B5707/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;29 SEP 2019
    21:46&nbsp;&nbsp;TO:&nbsp;&nbsp;29 DEC 2019 21:40&nbsp; EST<br /></span
  ><span class="notamText"
    >CRANE&nbsp;OPR&nbsp;AT&nbsp;36&nbsp;45&nbsp;52&nbsp;S&nbsp;174&nbsp;37&nbsp;08&nbsp;E,&nbsp;APRX&nbsp;1.6NM&nbsp;WNW&nbsp;THR&nbsp;RWY&nbsp;21,<br />
    MAX&nbsp;HGT&nbsp;390FT&nbsp;AMSL.&nbsp;OBSTACLE&nbsp;LIMITATION&nbsp;SFC&nbsp;INFRINGED&nbsp;BY&nbsp;138FT<br /><br /></span
  ><span class="notamSeries">B5901/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;07 OCT 2019
    19:44&nbsp;&nbsp;TO:&nbsp;&nbsp;05 JAN 2020 23:00&nbsp; EST<br /></span
  ><span class="notamText"
    >CRANES&nbsp;OPR&nbsp;VCY&nbsp;36&nbsp;47&nbsp;26&nbsp;S&nbsp;174&nbsp;39&nbsp;35&nbsp;E,&nbsp;APRX&nbsp;1800M&nbsp;E&nbsp;THR&nbsp;RWY&nbsp;26.<br />
    MAX&nbsp;HGT&nbsp;110FT&nbsp;AGL<br /><br /></span
  ><span class="notamSeries">B6136/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;19 OCT 2019
    04:51&nbsp;&nbsp;TO:&nbsp;&nbsp;17 JAN 2020 08:10&nbsp; EST<br /></span
  ><span class="notamText"
    >SR MINUS30-SS PLUS30<br />CRANE&nbsp;OPR&nbsp;AT&nbsp;36&nbsp;48&nbsp;48&nbsp;S&nbsp;174&nbsp;35&nbsp;57&nbsp;E&nbsp;APRX&nbsp;1.4NM&nbsp;SW&nbsp;THR&nbsp;RWY&nbsp;03.<br />
    MAX&nbsp;HGT&nbsp;90FT&nbsp;AGL<br /><br /></span
  ><span class="notamSeries">B6202/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;22 OCT 2019
    20:21&nbsp;&nbsp;TO:&nbsp;&nbsp;22 JAN 2020 01:00&nbsp; EST<br /></span
  ><span class="notamText"
    >HEL&nbsp;FATO&nbsp;WITH&nbsp;TLOF&nbsp;PAD&nbsp;4&nbsp;CLSD&nbsp;DUE&nbsp;WIP<br /><br /></span
  ><span class="notamSeries">B6421/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;03 NOV 2019
    20:19&nbsp;&nbsp;TO:&nbsp;&nbsp;PERM<br /></span
  ><span class="notamText"
    >REF&nbsp;AIP&nbsp;NZWP&nbsp;AD&nbsp;2&nbsp;-&nbsp;41.1&nbsp;ILS/DME&nbsp;OR&nbsp;LOC/DME&nbsp;RWY&nbsp;03,&nbsp;NZWP&nbsp;AD&nbsp;2&nbsp;-&nbsp;<br />
    41.3&nbsp;ILS/DME&nbsp;OR&nbsp;LOC/DME&nbsp;RWY&nbsp;21,&nbsp;NZWP&nbsp;AD&nbsp;2&nbsp;-&nbsp;43.1&nbsp;VOR/DME&nbsp;RWY&nbsp;03,&nbsp;<br />
    NZWP&nbsp;AD&nbsp;2&nbsp;-&nbsp;43.3&nbsp;VOR/DME&nbsp;RWY&nbsp;21,&nbsp;NZWP&nbsp;AD&nbsp;2&nbsp;-&nbsp;43.5&nbsp;VOR/DME&nbsp;RWY&nbsp;08,&nbsp;<br />
    NZWP&nbsp;AD&nbsp;2&nbsp;-&nbsp;43.7&nbsp;VOR/DME&nbsp;RWY&nbsp;26,&nbsp;NZWP&nbsp;AD&nbsp;-&nbsp;2&nbsp;45.1&nbsp;RNAV&nbsp;(GNSS)&nbsp;RWY&nbsp;<br />
    03,&nbsp;NZWP&nbsp;AD&nbsp;2&nbsp;-&nbsp;45.2&nbsp;RNAV&nbsp;(GNSS)&nbsp;RWY&nbsp;21<br />
    CAT&nbsp;D&nbsp;CIRCLING&nbsp;AIRSPACE&nbsp;CONTAINMENT&nbsp;NOT&nbsp;ASSURED<br /><br /></span

  ><span class="notamSeries">B6694/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;15 NOV 2019
    04:21&nbsp;&nbsp;TO:&nbsp;&nbsp;14 FEB 2020 04:00&nbsp; EST<br /></span
  ><span class="notamText"
    >DAILY 1830-0600<br />CRANE&nbsp;OPR&nbsp;AT&nbsp;36&nbsp;49&nbsp;16&nbsp;S&nbsp;174&nbsp;36&nbsp;23&nbsp;E&nbsp;APRX&nbsp;1.7NM&nbsp;S&nbsp;THR&nbsp;RWY&nbsp;03.<br />
    MAX&nbsp;HGT&nbsp;132FT&nbsp;AGL<br /><br /></span
  ><span class="notamSeries">B7029/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;01 DEC 2019
    03:44&nbsp;&nbsp;TO:&nbsp;&nbsp;01 MAR 2020 03:00&nbsp; EST<br /></span
  ><span class="notamText"
    >ACFT&nbsp;STAND&nbsp;1&nbsp;RESTRICTED&nbsp;TO&nbsp;CODE&nbsp;B&nbsp;ACFT&nbsp;AND&nbsp;SMALLER<br /><br /></span
  ><span class="notamSeries">B7115/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;04 DEC 2019
    23:00&nbsp;&nbsp;TO:&nbsp;&nbsp;17 JAN 2020 05:00&nbsp; <br /></span
  ><span class="notamText">ACFT&nbsp;STAND&nbsp;5&nbsp;CLSD<br /><br /></span
  ><span class="notamSeries">B6692/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;15 NOV 2019
    04:19&nbsp;&nbsp;TO:&nbsp;&nbsp;14 FEB 2020 04:00&nbsp; EST<br /></span
  ><span class="notamText"
    >SR MINUS30-SS PLUS30<br />CRANES&nbsp;OPR&nbsp;VCY&nbsp;36&nbsp;48&nbsp;16&nbsp;S&nbsp;174&nbsp;38&nbsp;07&nbsp;E&nbsp;APRX&nbsp;1500M&nbsp;ESE&nbsp;THR&nbsp;RWY&nbsp;03.<br />
    MAX&nbsp;HGT&nbsp;137FT&nbsp;AGL<br /><br /></span
  ><span class="notamLocation">NZCX (COROMANDEL) </span><br /><br /><span
    class="notamSeries"
    >A3403/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;11 NOV 2019
    02:07&nbsp;&nbsp;TO:&nbsp;&nbsp;15 DEC 2019 11:00&nbsp; <br /></span
  ><span class="notamText"
    >ACFT&nbsp;PARKING&nbsp;TEMPO&nbsp;MOVED&nbsp;FM&nbsp;NW&nbsp;SIDE&nbsp;OF&nbsp;HANGAR&nbsp;TO&nbsp;EAST&nbsp;SIDE&nbsp;OF<br />
    GRVL&nbsp;RWY&nbsp;12/30&nbsp;ON&nbsp;MOWN&nbsp;EDGE<br /><br /></span
  ><span class="notamLocation">NZAA (AUCKLAND) </span><br /><br /><span
    class="notamSeries"
    >B6515/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;06 NOV 2019
    23:23&nbsp;&nbsp;TO:&nbsp;&nbsp;PERM<br /></span
  ><span class="notamText"
    >REF&nbsp;AIP&nbsp;NZAA&nbsp;AD&nbsp;2-62.18<br />
    NZAA&nbsp;RNAV&nbsp;SID&nbsp;RWY&nbsp;23L&nbsp;(8)<br />
    BATOS&nbsp;THREE&nbsp;PAPA&nbsp;DEPARTURE&nbsp;-&nbsp;RNAV&nbsp;(BATOS3P)&nbsp;NOT&nbsp;AVBL<br /><br /></span

  ><span class="notamSeries">B6613/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;12 NOV 2019
    23:00&nbsp;&nbsp;TO:&nbsp;&nbsp;30 JAN 2020 10:59&nbsp; <br /></span
  ><span class="notamText"
    >HELIPORT&nbsp;FATO&nbsp;RE-LOCATED&nbsp;55M&nbsp;EAST&nbsp;OF&nbsp;PRESENT&nbsp;POSITION.&nbsp;<br />
    TLOF&nbsp;2&nbsp;RE-LOCATED&nbsp;TO&nbsp;MARKED&nbsp;AREA&nbsp;30M&nbsp;SOUTH&nbsp;OF&nbsp;TLOF&nbsp;1<br /><br /></span
  ><span class="notamSeries">B6904/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;25 NOV 2019
    02:52&nbsp;&nbsp;TO:&nbsp;&nbsp;PERM<br /></span
  ><span class="notamText"
    >REF&nbsp;AIP&nbsp;NZAA&nbsp;AD&nbsp;2-41.1&nbsp;ILS/DME&nbsp;OR&nbsp;LOC/DME&nbsp;RWY&nbsp;05R,<br />
    NZAA&nbsp;AD&nbsp;2-41.2&nbsp;ILS/DME&nbsp;OR&nbsp;LOC/DME&nbsp;RWY&nbsp;23L,<br />
    NZAA&nbsp;AD&nbsp;2-43.1&nbsp;VOR/DME&nbsp;RWY&nbsp;05R,&nbsp;NZAA&nbsp;AD&nbsp;2-43.2&nbsp;VOR/DME&nbsp;RWY&nbsp;23L,<br />
    NZAA&nbsp;AD&nbsp;2-45.1&nbsp;RNAV&nbsp;(GNSS)&nbsp;Z&nbsp;RWY&nbsp;05R,&nbsp;<br />
    NZAA&nbsp;AD&nbsp;2-45.2&nbsp;RNAV&nbsp;(GNSS)&nbsp;Z&nbsp;RWY&nbsp;23L,<br />
    NZAA&nbsp;AD&nbsp;2-70.1Y&nbsp;ILS/DME&nbsp;W&nbsp;OR&nbsp;LOC/DME&nbsp;W&nbsp;RWY&nbsp;23L,<br />
    NZAA&nbsp;AD&nbsp;2-70.2Y&nbsp;LOC/DME&nbsp;W&nbsp;RWY&nbsp;05R,&nbsp;NZAA&nbsp;AD&nbsp;2-70.3Y&nbsp;VOR/DME&nbsp;W&nbsp;RWY&nbsp;05R,<br />
    NZAA&nbsp;AD&nbsp;2-70.4Y&nbsp;VOR/DME&nbsp;W&nbsp;RWY&nbsp;23L,&nbsp;NZAA&nbsp;AD&nbsp;2-70.5Y&nbsp;VOR/DME&nbsp;W&nbsp;RWY&nbsp;23L,<br />
    NZAA&nbsp;AD&nbsp;2-70.21Y&nbsp;ILS/DME&nbsp;E&nbsp;OR&nbsp;LOC/DME&nbsp;E&nbsp;RWY&nbsp;05R,<br />
    NZAA&nbsp;AD&nbsp;2-70.22Y&nbsp;LOC/DME&nbsp;E&nbsp;RWY&nbsp;23L,<br />
    NZAA&nbsp;AD&nbsp;2-70.23Y&nbsp;VOR/DME&nbsp;E&nbsp;RWY&nbsp;05R,&nbsp;<br />
    NZAA&nbsp;AD&nbsp;2-70.24Y&nbsp;VOR/DME&nbsp;E&nbsp;RWY&nbsp;23L,<br />
    NZAA&nbsp;AD&nbsp;2-70.25Y&nbsp;RNAV&nbsp;(GNSS)&nbsp;E&nbsp;RWY&nbsp;05R<br />
    CIRCLING&nbsp;MINIMA&nbsp;AMENDED&nbsp;AS&nbsp;FOLLOWS:<br />
    CAT&nbsp;B&nbsp;630&nbsp;(607)&nbsp;-&nbsp;2800<br />
    CAT&nbsp;C&nbsp;790&nbsp;(767)&nbsp;-&nbsp;3700<br />
    CAT&nbsp;D&nbsp;930&nbsp;(907)&nbsp;-&nbsp;4600<br /><br /></span

  ><span class="notamSeries">B6905/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;25 NOV 2019
    03:14&nbsp;&nbsp;TO:&nbsp;&nbsp;25 FEB 2020 00:00&nbsp; EST<br /></span
  ><span class="notamText"
    >TWY&nbsp;L&nbsp;TWO&nbsp;ADJ&nbsp;CL&nbsp;LIGHTS&nbsp;AT&nbsp;INTERSECTION&nbsp;OF&nbsp;TAXIWAYS&nbsp;L&nbsp;AND&nbsp;E&nbsp;U/S<br /><br /></span
  ><span class="notamSeries">B6937/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;26 NOV 2019
    19:04&nbsp;&nbsp;TO:&nbsp;&nbsp;25 FEB 2020 19:00&nbsp; <br /></span
  ><span class="notamText"
    >LIT&nbsp;CRANE&nbsp;OPR&nbsp;INTERMITTENTLY&nbsp;APRX&nbsp;1.35NM&nbsp;BRG&nbsp;300&nbsp;DEG&nbsp;MAG&nbsp;FROM&nbsp;<br />
    CONTROL&nbsp;TWR.&nbsp;MAX&nbsp;HGT&nbsp;262FT&nbsp;AMSL<br /><br /></span
  ><span class="notamSeries">B7154/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;06 DEC 2019
    18:00&nbsp;&nbsp;TO:&nbsp;&nbsp;07 DEC 2019 01:00&nbsp; <br /></span
  ><span class="notamText"
    >DELAY&nbsp;MAY&nbsp;BE&nbsp;EXPERIENCED&nbsp;WI&nbsp;AUCKLAND&nbsp;CTR/C&nbsp;DUE&nbsp;REDUCED&nbsp;CAPACITY.<br />
    INSTR&nbsp;TRAINING&nbsp;AVBL&nbsp;WITH&nbsp;PRIOR&nbsp;APPROVAL&nbsp;FROM&nbsp;ATS&nbsp;DUTY&nbsp;MANAGER<br />
    TEL&nbsp;+64&nbsp;3&nbsp;358&nbsp;1694.&nbsp;VFR&nbsp;OPS&nbsp;MAY&nbsp;BE&nbsp;PROHIBITED&nbsp;AT&nbsp;TIMES<br /><br /></span

  ><span class="notamLocation">NZAR (ARDMORE) </span><br /><br /><span
    class="notamSeries"
    >A2687/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;15 SEP 2019
    21:20&nbsp;&nbsp;TO:&nbsp;&nbsp;10 DEC 2019 22:00&nbsp; EST<br /></span
  ><span class="notamText"
    >TWY&nbsp;J&nbsp;WEST&nbsp;OF&nbsp;RWY&nbsp;03/21&nbsp;SFC&nbsp;COND&nbsp;ROUGH.&nbsp;TWY&nbsp;SHOULDERS&nbsp;NOT&nbsp;AVBL&nbsp;<br />
    FOR&nbsp;USE,&nbsp;REMAIN&nbsp;WI&nbsp;5M&nbsp;OF&nbsp;TWY&nbsp;CL<br /><br /></span
  ><span class="notamSeries">A3266/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;30 OCT 2019
    21:31&nbsp;&nbsp;TO:&nbsp;&nbsp;30 JAN 2020 22:00&nbsp; EST<br /></span
  ><span class="notamText"
    >RWY&nbsp;03/21&nbsp;AND&nbsp;GRASS&nbsp;RWY&nbsp;03/21&nbsp;SIMULTANEOUS&nbsp;PARALLEL&nbsp;OPS&nbsp;PROHIBITED<br /><br /></span
  ><span class="notamLocation">NZTH (THAMES) </span><br /><br /><span
    class="notamSeries"
    >A1956/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;10 JUL 2019
    00:00&nbsp;&nbsp;TO:&nbsp;&nbsp;PERM<br /></span
  ><span class="notamText"
    >PARL&nbsp;OPEN&nbsp;DRAINS&nbsp;INSTALLED&nbsp;ON&nbsp;NORTHERN&nbsp;SIDE&nbsp;OF&nbsp;GRASS&nbsp;RWY&nbsp;05/23<br /><br /></span
  ><span class="notamSeries">A2077/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;22 JUL 2019
    00:05&nbsp;&nbsp;TO:&nbsp;&nbsp;PERM<br /></span
  ><span class="notamText"
    >PARL&nbsp;OPEN&nbsp;DRAIN&nbsp;INSTALLED&nbsp;ON&nbsp;EASTERN&nbsp;SIDE&nbsp;OF&nbsp;GRASS&nbsp;RWY&nbsp;14/32<br />
    BTN&nbsp;THR&nbsp;GRASS&nbsp;RWY&nbsp;14&nbsp;AND&nbsp;INT&nbsp;OF&nbsp;GRASS&nbsp;RWY&nbsp;14/32&nbsp;AND&nbsp;GRASS&nbsp;RWY&nbsp;05/23<br /><br /></span
  ><span class="notamLocation">NZPU (PUKEKOHE) </span><br /><br /><span
    class="notamSeries"
    >A2706/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;16 SEP 2019
    21:04&nbsp;&nbsp;TO:&nbsp;&nbsp;16 DEC 2019 00:00&nbsp; EST<br /></span
  ><span class="notamText"
    >AD&nbsp;CLSD&nbsp;DUE&nbsp;MULTIPLE&nbsp;CRANES&nbsp;OPR&nbsp;VCY&nbsp;TREATMENT&nbsp;PLANT,&nbsp;MAX&nbsp;HGT<br />
    150FT&nbsp;AGL.&nbsp;AD&nbsp;AVBL&nbsp;WITH&nbsp;PRIOR&nbsp;PERMISSION&nbsp;FROM&nbsp;OPR&nbsp;TEL&nbsp;027&nbsp;274&nbsp;2322<br /><br /></span
  ><span class="notamLocation">NZTG (TAURANGA) </span><br /><br /><span
    class="notamSeries"
    >B5856/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;04 OCT 2019
    01:38&nbsp;&nbsp;TO:&nbsp;&nbsp;10 DEC 2019 00:00&nbsp; EST<br /></span
  ><span class="notamText"
    >SR-SS<br />CRANE&nbsp;OPR&nbsp;APRX&nbsp;1.63NM&nbsp;E&nbsp;THR&nbsp;RWY&nbsp;07.<br />
    CRANE&nbsp;LOCATED&nbsp;BTN&nbsp;37&nbsp;40&nbsp;34&nbsp;S&nbsp;176&nbsp;13&nbsp;22&nbsp;E&nbsp;AND&nbsp;37&nbsp;40&nbsp;38&nbsp;S&nbsp;176&nbsp;13&nbsp;22&nbsp;E.<br />
    MAX&nbsp;HGT&nbsp;113FT&nbsp;AMSL.<br />
    HIGH&nbsp;POINT&nbsp;LIT&nbsp;BY&nbsp;MEDIUM&nbsp;INTENSITY&nbsp;WHITE&nbsp;FLASHING&nbsp;LIGHT.&nbsp;CRANE<br />
    LOWERED&nbsp;BELOW&nbsp;PUBLISHED&nbsp;1:50&nbsp;TAKE&nbsp;OFF&nbsp;GRADIENT&nbsp;DAILY&nbsp;BETWEEN&nbsp;SUNSET<br />
    AND&nbsp;SUNRISE.&nbsp;RWY&nbsp;07&nbsp;1:50&nbsp;TODA&nbsp;1435M&nbsp;DURING&nbsp;CRANE&nbsp;OPERATIONS<br /><br /></span

  ><span class="notamSeries">B6081/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;17 OCT 2019
    03:57&nbsp;&nbsp;TO:&nbsp;&nbsp;17 DEC 2019 00:00&nbsp; EST<br /></span
  ><span class="notamText"
    >THR&nbsp;GRASS&nbsp;RWY&nbsp;34&nbsp;DISPLACED&nbsp;100M.&nbsp;EFFECTIVE&nbsp;OPR&nbsp;LENGTH&nbsp;575M<br /><br /></span
  ><span class="notamSeries">B7075/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;02 DEC 2019
    22:34&nbsp;&nbsp;TO:&nbsp;&nbsp;28 FEB 2020 00:00&nbsp; EST<br /></span
  ><span class="notamText"
    >CRANE&nbsp;OPR&nbsp;37&nbsp;41&nbsp;15&nbsp;S&nbsp;176&nbsp;10&nbsp;06&nbsp;E,&nbsp;APRX&nbsp;2NM&nbsp;WSW&nbsp;RWY&nbsp;25&nbsp;THR.<br />
    LIT&nbsp;BY&nbsp;WHITE&nbsp;FLASHING&nbsp;LIGHT.&nbsp;MAX&nbsp;HGT&nbsp;230FT&nbsp;AMSL<br /><br /></span
  ><span class="notamLocation">NZHN (HAMILTON) </span><br /><br /><span
    class="notamSeries"
    >B5426/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;13 SEP 2019
    03:12&nbsp;&nbsp;TO:&nbsp;&nbsp;09 DEC 2019 23:00&nbsp; EST<br /></span
  ><span class="notamText"
    >FENCE&nbsp;ERECTED&nbsp;10M&nbsp;WEST&nbsp;OF&nbsp;TWY&nbsp;B&nbsp;CL&nbsp;SOUTH&nbsp;OF&nbsp;WESTERN&nbsp;APN,&nbsp;RUNNING<br />
    PARALLEL&nbsp;TO&nbsp;TWY&nbsp;B.&nbsp;HEIGHT&nbsp;8FT&nbsp;AGL,&nbsp;APRX&nbsp;LENGTH&nbsp;120M)<br /><br /></span
  ><span class="notamSeries">B6120/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;18 OCT 2019
    04:01&nbsp;&nbsp;TO:&nbsp;&nbsp;17 JAN 2020 00:00&nbsp; EST<br /></span
  ><span class="notamText"
    >TAXIWAYS&nbsp;B&nbsp;AND&nbsp;C&nbsp;BTN&nbsp;RWY&nbsp;HLDG&nbsp;POSITIONS&nbsp;C4&nbsp;AND&nbsp;B1,&nbsp;WEST&nbsp;OF&nbsp;RWY<br />
    HLDG&nbsp;POSITIONS&nbsp;D1&nbsp;AND&nbsp;E1,&nbsp;ARE&nbsp;NOT&nbsp;SUBJECT&nbsp;TO&nbsp;SFC&nbsp;MOVEMENT&nbsp;<br />
    CONTROL&nbsp;BY&nbsp;ATC.&nbsp;ACFT,&nbsp;VEHICLES&nbsp;OR&nbsp;PERSONNEL&nbsp;<br />
    ENTERING&nbsp;THIS&nbsp;AREA&nbsp;MUST&nbsp;REMAIN&nbsp;VIGILANT&nbsp;FOR&nbsp;THE&nbsp;MOVEMENT&nbsp;OF&nbsp;<br />
    OTHER&nbsp;ACFT,&nbsp;VEHICLES&nbsp;OR&nbsp;PERSONNEL&nbsp;AND&nbsp;GIVE&nbsp;WAY&nbsp;AS&nbsp;NECESSARY<br /><br /></span

  ><span class="notamLocation">NZWK (WHAKATANE) </span><br /><br /><span
    class="notamSeries"
    >A3589/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;25 NOV 2019
    00:52&nbsp;&nbsp;TO:&nbsp;&nbsp;29 JAN 2020 01:00&nbsp; EST<br /></span
  ><span class="notamText"
    >PAL&nbsp;WARNING&nbsp;LIGHTS&nbsp;(WHITE)&nbsp;ON&nbsp;THE&nbsp;TOWER&nbsp;(ON&nbsp;TOP&nbsp;OF&nbsp;THE&nbsp;TERMINAL)&nbsp;<br />
    U/S<br /><br /></span
  ><span class="notamLocation">NZRO (ROTORUA) </span><br /><br /><span
    class="notamSeries"
    >B6424/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;03 NOV 2019
    21:44&nbsp;&nbsp;TO:&nbsp;&nbsp;PERM<br /></span
  ><span class="notamText"
    >REF&nbsp;AIP&nbsp;NZRO&nbsp;AD&nbsp;2-45.4&nbsp;RNAV&nbsp;(RNP)&nbsp;Y&nbsp;RWY&nbsp;36&nbsp;EFFECTIVE&nbsp;24&nbsp;MAY&nbsp;18<br />
    APCH&nbsp;MINIMA&nbsp;RNP&nbsp;0.16&nbsp;NOT&nbsp;AVBL<br /><br /></span
  ><span class="notamSeries">B6425/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;03 NOV 2019
    21:51&nbsp;&nbsp;TO:&nbsp;&nbsp;PERM<br /></span
  ><span class="notamText"
    >REF&nbsp;AIP&nbsp;NZRO&nbsp;AD&nbsp;2-45.3&nbsp;RNAV&nbsp;(RNP)&nbsp;Y&nbsp;RWY&nbsp;18&nbsp;EFFECTIVE&nbsp;24&nbsp;MAY&nbsp;18<br />
    RNP&nbsp;0.10&nbsp;CAT&nbsp;C&nbsp;MINIMA&nbsp;AMENDED&nbsp;TO&nbsp;1340(405)-1800<br /><br /></span
  ><span class="notamLocation">NZTT (TE KUITI) </span><br /><br /><span
    class="notamSeries"
    >A3292/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;31 OCT 2019
    22:19&nbsp;&nbsp;TO:&nbsp;&nbsp;PERM<br /></span
  ><span class="notamText"
    >REF&nbsp;AIP&nbsp;NZTT&nbsp;AD&nbsp;2-51.1&nbsp;AND&nbsp;NZTT&nbsp;2-52.1<br />
    NZTT&nbsp;AD&nbsp;2&nbsp;51.1&nbsp;AD.&nbsp;AMD&nbsp;LENGTH&nbsp;RWY&nbsp;16/34&nbsp;BITUMEN&nbsp;PORTION&nbsp;TO&nbsp;READ<br />
    550M&nbsp;X&nbsp;5M.<br />
    NZTT&nbsp;AD&nbsp;2&nbsp;51.2&nbsp;OPERATIONAL&nbsp;DATA.&nbsp;AMD&nbsp;RWY&nbsp;16/34&nbsp;SFC&nbsp;TO&nbsp;READ&nbsp;B/GRVL/GR&nbsp;<br />
    AND&nbsp;ASTERISK&nbsp;FOOTNOTE&nbsp;TO&nbsp;READ&nbsp;BITUMEN&nbsp;550M&nbsp;X&nbsp;5M/GRVL&nbsp;RWY&nbsp;160M&nbsp;X&nbsp;5M<br /><br /></span

  ><span class="notamLocation">NZAP (TAUPO) </span><br /><br /><span
    class="notamSeries"
    >A3609/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;25 NOV 2019
    23:48&nbsp;&nbsp;TO:&nbsp;&nbsp;20 DEC 2019 04:00&nbsp; <br /></span
  ><span class="notamText"
    >TANK&nbsp;INSTALLATION&nbsp;ON&nbsp;SOUTHERN&nbsp;SIDE&nbsp;OF&nbsp;AVGAS&nbsp;PUMPS.&nbsp;MEN&nbsp;AND&nbsp;EQPT<br />
    OPERATING.&nbsp;EXCAVATOR&nbsp;PARKED&nbsp;ON&nbsp;SITE.&nbsp;WHEN&nbsp;OPR&nbsp;MAX&nbsp;HGT&nbsp;7M&nbsp;AGL<br /><br /></span
  ><span class="notamSeries">A3752/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;04 DEC 2019
    23:52&nbsp;&nbsp;TO:&nbsp;&nbsp;12 DEC 2019 04:00&nbsp; EST<br /></span
  ><span class="notamText"
    >MOVEMENT&nbsp;AREA&nbsp;GUIDANCE&nbsp;SIGN&nbsp;RWY&nbsp;HLDG&nbsp;PSN&nbsp;B1&nbsp;UNLIT<br /><br /></span
  ><span class="notamLocation">NZTM (TAUMARUNUI) </span><br /><br /><span
    class="notamSeries"
    >A3444/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;07 DEC 2019
    08:00&nbsp;&nbsp;TO:&nbsp;&nbsp;07 DEC 2019 08:30&nbsp; <br /></span
  ><span class="notamText"
    >FIREWORKS&nbsp;DISPLAY&nbsp;WILL&nbsp;TAKE&nbsp;PLACE&nbsp;WITHIN&nbsp;100M&nbsp;RADIUS&nbsp;OF<br />
    38&nbsp;53&nbsp;09.67&nbsp;S&nbsp;175&nbsp;15&nbsp;56.59&nbsp;E&nbsp;(TAUMARUNUI&nbsp;DOMAIN)&nbsp;APRX&nbsp;2.5&nbsp;NM&nbsp;S&nbsp;NZTM<br />
    AND&nbsp;0.7NM&nbsp;NE&nbsp;NZJT<br />
    LOWER:&nbsp;SFC&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UPPER:&nbsp;1200FT
    AMSL<br /><br /></span

  ><span class="notamLocation">NZNR (NAPIER) </span><br /><br /><span
    class="notamSeries"
    >B5647/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;25 SEP 2019
    23:14&nbsp;&nbsp;TO:&nbsp;&nbsp;23 DEC 2019 00:00&nbsp; EST<br /></span
  ><span class="notamText"
    >WDI&nbsp;GRASS&nbsp;RWY&nbsp;34&nbsp;U/S<br /><br /></span
  ><span class="notamSeries">B5695/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;29 SEP 2019
    03:46&nbsp;&nbsp;TO:&nbsp;&nbsp;15 DEC 2019 21:00&nbsp; EST<br /></span
  ><span class="notamText"
    >AD&nbsp;WIP&nbsp;200M&nbsp;SE&nbsp;THR&nbsp;RWY&nbsp;25.&nbsp;MEN&nbsp;AND&nbsp;EQPT&nbsp;OPR<br /><br /></span
  ><span class="notamSeries">B6365/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;31 OCT 2019
    02:11&nbsp;&nbsp;TO:&nbsp;&nbsp;30 JAN 2020 04:00&nbsp; EST<br /></span
  ><span class="notamText"
    >CRANE&nbsp;OPR&nbsp;APRX&nbsp;1.5NM&nbsp;SE&nbsp;THR&nbsp;RWY&nbsp;34.&nbsp;MAX&nbsp;HGT&nbsp;188FT&nbsp;AGL<br /><br /></span
  ><span class="notamSeries">B6696/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;15 NOV 2019
    04:58&nbsp;&nbsp;TO:&nbsp;&nbsp;14 FEB 2020 04:00&nbsp; EST<br /></span
  ><span class="notamText"
    >ACFT&nbsp;PARKING&nbsp;NOT&nbsp;AVBL&nbsp;ON&nbsp;GRASS&nbsp;MOV&nbsp;AREA&nbsp;BTN&nbsp;FLIGHT&nbsp;CARE&nbsp;AND&nbsp;TWR,<br />
    OR&nbsp;ON&nbsp;APRON&nbsp;WI&nbsp;10M&nbsp;OF&nbsp;THIS&nbsp;AREA<br /><br /></span
  ><span class="notamSeries">B6983/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;07 DEC 2019
    18:50&nbsp;&nbsp;TO:&nbsp;&nbsp;07 DEC 2019 23:00&nbsp; <br /></span
  ><span class="notamText"
    >NAPIER&nbsp;CTR/D&nbsp;AND&nbsp;NAPIER&nbsp;CTA/D&nbsp;INOP.&nbsp;AD&nbsp;CTL&nbsp;SER&nbsp;AND&nbsp;APP&nbsp;NOT&nbsp;AVBL.<br />
    REF&nbsp;CONTINGENCY&nbsp;NOTAM&nbsp;B6982/19<br /><br /></span
  ><span class="notamSeries">B7057/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;02 DEC 2019
    04:50&nbsp;&nbsp;TO:&nbsp;&nbsp;20 DEC 2019 04:00&nbsp; EST<br /></span
  ><span class="notamText"
    >1930-0500 EXC SAT<br />AD&nbsp;WIP.&nbsp;MEN&nbsp;AND&nbsp;EQPT&nbsp;OPR&nbsp;200M&nbsp;S&nbsp;FLIGHTCARE<br /><br /></span
  ><span class="notamLocation">NZHS (HASTINGS) </span><br /><br /><span
    class="notamSeries"
    >A3518/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;19 NOV 2019
    01:53&nbsp;&nbsp;TO:&nbsp;&nbsp;19 DEC 2019 01:00&nbsp; <br /></span
  ><span class="notamText"
    >MEN&nbsp;AND&nbsp;EQPT&nbsp;OPR&nbsp;EAST&nbsp;THR&nbsp;RWY&nbsp;19<br /><br /></span
  ><span class="notamLocation">NZWU (WHANGANUI) </span><br /><br /><span
    class="notamSeries"
    >A2927/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;04 OCT 2019
    04:32&nbsp;&nbsp;TO:&nbsp;&nbsp;03 JAN 2020 03:00&nbsp; EST<br /></span
  ><span class="notamText"
    >GRASS&nbsp;RWY&nbsp;11L/29R&nbsp;CLOSED&nbsp;DUE&nbsp;SFC&nbsp;COND<br /><br /></span
  ><span class="notamSeries">A3777/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;06 DEC 2019
    04:30&nbsp;&nbsp;TO:&nbsp;&nbsp;06 DEC 2019 23:00&nbsp; EST<br /></span
  ><span class="notamText"
    >VISIBILITY&nbsp;NOT&nbsp;REPORTED&nbsp;IN&nbsp;METAR&nbsp;AUTO,&nbsp;SENSOR&nbsp;U/S<br /><br /></span
  ><span class="notamLocation">NZOH (OHAKEA) </span><br /><br /><span
    class="notamSeries"
    >B6427/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;03 NOV 2019
    22:48&nbsp;&nbsp;TO:&nbsp;&nbsp;30 JAN 2020 22:45&nbsp; EST<br /></span
  ><span class="notamText"
    >BIRD&nbsp;HAZARD&nbsp;(BLACK&nbsp;BACKED&nbsp;GULLS)&nbsp;EXISTS&nbsp;IN&nbsp;VCY&nbsp;RANGITIKEI&nbsp;RIVER<br />
    APRX&nbsp;3NM&nbsp;N&nbsp;THR&nbsp;RWY&nbsp;27.&nbsp;MAX&nbsp;HGT&nbsp;2000FT&nbsp;AGL<br /><br /></span
  ><span class="notamSeries">B6508/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;06 NOV 2019
    21:00&nbsp;&nbsp;TO:&nbsp;&nbsp;09 DEC 2019 04:00&nbsp; <br /></span
  ><span class="notamText"
    >RWY&nbsp;15/33&nbsp;ALS&nbsp;NOT&nbsp;AVBL&nbsp;DUE&nbsp;WIP<br /><br /></span
  ><span class="notamSeries">B6502/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;06 NOV 2019
    11:00&nbsp;&nbsp;TO:&nbsp;&nbsp;06 JAN 2020 04:00&nbsp; EST<br /></span
  ><span class="notamText"
    >UNPUBLISHED&nbsp;TAXILANE&nbsp;SOUTHERN&nbsp;EDGE&nbsp;NORTHERN&nbsp;APRON&nbsp;BTN&nbsp;TWY&nbsp;C&nbsp;AND<br />
    TWY&nbsp;D&nbsp;RESTRICTED&nbsp;TO&nbsp;CODE&nbsp;B&nbsp;ACFT&nbsp;OR&nbsp;SMALLER<br /><br /></span
  ><span class="notamSeries">B6673/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;14 NOV 2019
    05:24&nbsp;&nbsp;TO:&nbsp;&nbsp;05 JAN 2020 19:00&nbsp; <br /></span
  ><span class="notamText"
    >TWY&nbsp;A&nbsp;EAST&nbsp;OF&nbsp;TWY&nbsp;B&nbsp;RESTRICTED&nbsp;TO&nbsp;ACFT&nbsp;WITH&nbsp;MAX&nbsp;WING&nbsp;SPAN&nbsp;NOT<br />
    EXCEEDING&nbsp;42M<br /><br /></span
  ><span class="notamLocation">NZPO (PORANGAHAU) </span><br /><br /><span
    class="notamSeries"
    >A2802/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;24 SEP 2019
    04:47&nbsp;&nbsp;TO:&nbsp;&nbsp;PERM<br /></span
  ><span class="notamText"
    >DOWNWIND&nbsp;LEG&nbsp;TO&nbsp;BE&nbsp;FLOWN&nbsp;NO&nbsp;CLOSER&nbsp;TO&nbsp;AD&nbsp;THAN&nbsp;W&nbsp;BANK&nbsp;OF&nbsp;<br />
    PORANGAHAU&nbsp;RIVER<br /><br /></span
  ><span class="notamLocation">NZPM (PALMERSTON NORTH) </span><br /><br /><span
    class="notamSeries"
    >B5890/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;07 OCT 2019
    05:46&nbsp;&nbsp;TO:&nbsp;&nbsp;PERM<br /></span
  ><span class="notamText"
    >REF&nbsp;AIP&nbsp;NZPM&nbsp;AD&nbsp;2-45.1<br />
    RNAV&nbsp;(GNSS)&nbsp;RWY&nbsp;07&nbsp;EFFECTIVE&nbsp;10&nbsp;NOV&nbsp;16<br />
    LNAV/VNAV&nbsp;MINIMA&nbsp;AMENDED&nbsp;AS&nbsp;FOLLOWS:<br />
    CAT&nbsp;A/B&nbsp;530&nbsp;(409)&nbsp;-&nbsp;1600<br />
    CAT&nbsp;C&nbsp;550&nbsp;(429)&nbsp;-&nbsp;2400<br />
    CAT&nbsp;D&nbsp;580&nbsp;(459)&nbsp;-&nbsp;2400<br /><br /></span

  ><span class="notamSeries">B6723/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;17 NOV 2019
    21:41&nbsp;&nbsp;TO:&nbsp;&nbsp;30 JAN 2020 21:00&nbsp; <br /></span
  ><span class="notamText"
    >TAXIWAYS&nbsp;D&nbsp;AND&nbsp;H&nbsp;CLSD&nbsp;TO&nbsp;JET&nbsp;ACFT&nbsp;OPS<br /><br /></span
  ><span class="notamSeries">B6938/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;01 DEC 2019
    19:30&nbsp;&nbsp;TO:&nbsp;&nbsp;08 DEC 2019 17:00&nbsp; EST<br /></span
  ><span class="notamText"
    >ALL&nbsp;MOVEMENT&nbsp;AREAS&nbsp;SURFACE&nbsp;COND&nbsp;TESTING.&nbsp;MEN&nbsp;AND&nbsp;EQPT&nbsp;OPR<br /><br /></span
  ><span class="notamLocation">NZOT (OTAKI) </span><br /><br /><span
    class="notamSeries"
    >A3692/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;01 DEC 2019
    20:30&nbsp;&nbsp;TO:&nbsp;&nbsp;20 DEC 2019 03:00&nbsp; <br /></span
  ><span class="notamText"
    >SUN-FRI 2030-0300<br />REMOTELY&nbsp;PILOTED&nbsp;ACFT&nbsp;ACT&nbsp;WILL&nbsp;TAKE&nbsp;PLACE&nbsp;WI&nbsp;800M&nbsp;RADIUS&nbsp;<br />
    40&nbsp;45&nbsp;24&nbsp;S&nbsp;175&nbsp;09&nbsp;53&nbsp;E&nbsp;APRX&nbsp;1.8NM&nbsp;N&nbsp;NZOT.&nbsp;MAX&nbsp;HGT&nbsp;300FT&nbsp;AGL<br /><br /></span
  ><span class="notamSeries">A3693/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;01 DEC 2019
    20:30&nbsp;&nbsp;TO:&nbsp;&nbsp;20 DEC 2019 03:00&nbsp; <br /></span
  ><span class="notamText"
    >SUN-FRI 2030-0300<br />REMOTELY&nbsp;PILOTED&nbsp;ACFT&nbsp;ACT&nbsp;WILL&nbsp;TAKE&nbsp;PLACE&nbsp;WI&nbsp;2030M&nbsp;RADIUS&nbsp;<br />
    40&nbsp;47&nbsp;30&nbsp;S&nbsp;175&nbsp;07&nbsp;03&nbsp;E&nbsp;APRX&nbsp;1.6NM&nbsp;SW&nbsp;NZOT.&nbsp;MAX&nbsp;HGT&nbsp;300FT&nbsp;AGL<br /><br /></span
  ><span class="notamSeries">A3694/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;01 DEC 2019
    20:30&nbsp;&nbsp;TO:&nbsp;&nbsp;20 DEC 2019 03:00&nbsp; <br /></span
  ><span class="notamText"
    >SUN-FRI 2030-0300<br />REMOTELY&nbsp;PILOTED&nbsp;ACFT&nbsp;ACT&nbsp;WILL&nbsp;TAKE&nbsp;PLACE&nbsp;WI&nbsp;950M&nbsp;RADIUS&nbsp;<br />
    40&nbsp;46&nbsp;37&nbsp;S&nbsp;175&nbsp;08&nbsp;11&nbsp;E&nbsp;APRX&nbsp;1500M&nbsp;W&nbsp;NZOT.&nbsp;MAX&nbsp;HGT&nbsp;300FT&nbsp;AGL<br /><br /></span
  ><span class="notamSeries">A3695/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;01 DEC 2019
    20:30&nbsp;&nbsp;TO:&nbsp;&nbsp;20 DEC 2019 03:00&nbsp; <br /></span
  ><span class="notamText"
    >SUN-FRI 2030-0300<br />REMOTELY&nbsp;PILOTED&nbsp;ACFT&nbsp;ACT&nbsp;WILL&nbsp;TAKE&nbsp;PLACE&nbsp;WI&nbsp;922M&nbsp;RADIUS<br />
    40&nbsp;45&nbsp;44&nbsp;S&nbsp;175&nbsp;08&nbsp;54&nbsp;E&nbsp;APRX&nbsp;1.1NM&nbsp;NNW&nbsp;NZOT.&nbsp;MAX&nbsp;HGT&nbsp;200FT&nbsp;AGL<br /><br /></span
  ><span class="notamLocation">NZPP (PARAPARAUMU) </span><br /><br /><span
    class="notamSeries"
    >A2950/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;07 OCT 2019
    02:25&nbsp;&nbsp;TO:&nbsp;&nbsp;16 DEC 2019 23:00&nbsp; EST<br /></span
  ><span class="notamText"
    >REF&nbsp;AIP&nbsp;NZPP&nbsp;AD&nbsp;2-45.2,&nbsp;NZPP&nbsp;RNAV&nbsp;(GNSS)&nbsp;RWY&nbsp;34&nbsp;EFFECTIVE&nbsp;24&nbsp;MAY<br />
    2018.<br />
    CAUTION&nbsp;VISUAL&nbsp;SEGMENT&nbsp;SURFACE&nbsp;RWY&nbsp;34&nbsp;PENETRATED&nbsp;BY&nbsp;TREES&nbsp;572M&nbsp;SSW<br />
    FROM&nbsp;THR&nbsp;RWY&nbsp;34,&nbsp;MAX&nbsp;ELEVATION&nbsp;84FT&nbsp;AMSL<br /><br /></span

  ><span class="notamSeries">A2975/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;08 OCT 2019
    04:48&nbsp;&nbsp;TO:&nbsp;&nbsp;16 DEC 2019 23:00&nbsp; EST<br /></span
  ><span class="notamText"
    >RWY&nbsp;34&nbsp;1:40&nbsp;APPROACH&nbsp;SURFACE&nbsp;PENETRATED&nbsp;BY&nbsp;TREES&nbsp;531M&nbsp;AND<br />
    779M&nbsp;S&nbsp;THR&nbsp;RWY&nbsp;34,&nbsp;MAX&nbsp;HEIGHT&nbsp;68FT&nbsp;AMSL<br /><br /></span
  ><span class="notamSeries">A2979/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;08 OCT 2019
    20:56&nbsp;&nbsp;TO:&nbsp;&nbsp;16 DEC 2019 23:00&nbsp; EST<br /></span
  ><span class="notamText"
    >REF&nbsp;AIP&nbsp;SUP&nbsp;7/19&nbsp;CRITICAL&nbsp;OBSTACLES&nbsp;AND&nbsp;SURVEY&nbsp;DATA<br />
    ADDITIONAL&nbsp;RWY&nbsp;16&nbsp;CRITICAL&nbsp;OBST&nbsp;(TREE&nbsp;TOPS)&nbsp;AS&nbsp;FOLLOWS:&nbsp;<br />
    DIST&nbsp;FROM&nbsp;SOT&nbsp;&nbsp;&nbsp;&nbsp;HEIGHT&nbsp;<br />
    1888M&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;68FT&nbsp;AMSL<br />
    1919M&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;84FT&nbsp;AMSL<br />
    2045M&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;76FT&nbsp;AMSL<br />
    2384M&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;100FT&nbsp;AMSL<br />
    2973M&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;123FT&nbsp;AMSL<br />
    <br />
    AMEND&nbsp;RWY&nbsp;16&nbsp;TAKE-OFF&nbsp;DISTANCES:<br />
    1:40&nbsp;1240M<br />
    1:50&nbsp;1069M<br /><br /></span

  ><span class="notamSeries">A3398/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;10 NOV 2019
    21:52&nbsp;&nbsp;TO:&nbsp;&nbsp;17 DEC 2019 23:00&nbsp; EST<br /></span
  ><span class="notamText">ABN&nbsp;U/S<br /><br /></span
  ><span class="notamLocation">NZMS (MASTERTON) </span><br /><br /><span
    class="notamSeries"
    >A3421/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;12 NOV 2019
    19:16&nbsp;&nbsp;TO:&nbsp;&nbsp;12 FEB 2020 23:59&nbsp; EST<br /></span
  ><span class="notamText"
    >GRASS&nbsp;RWY&nbsp;06L/24R&nbsp;CLSD<br /><br /></span
  ><span class="notamLocation">NZSO (MARLBOROUGH SOUNDS) </span
  ><br /><br /><span class="notamSeries">A3768/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;05 DEC 2019
    21:27&nbsp;&nbsp;TO:&nbsp;&nbsp;PERM<br /></span
  ><span class="notamText"
    >REF&nbsp;AIP&nbsp;NZSO&nbsp;AD&nbsp;2-52.1&nbsp;OPR&nbsp;DATA<br />
    AMD&nbsp;OPR&nbsp;TEL&nbsp;FM&nbsp;(03)&nbsp;520&nbsp;3200&nbsp;TO&nbsp;(03)&nbsp;520&nbsp;7400.&nbsp;DELETE&nbsp;FAX&nbsp;NUMBER<br /><br /></span
  ><span class="notamLocation">NZNS (NELSON) </span><br /><br /><span
    class="notamSeries"
    >B6322/18</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;07 NOV 2018
    21:28&nbsp;&nbsp;TO:&nbsp;&nbsp;PERM<br /></span
  ><span class="notamText"
    >REF&nbsp;AIP&nbsp;NZNS&nbsp;AD&nbsp;2-52.1&nbsp;NELSON&nbsp;OPERATIONAL&nbsp;DATA&nbsp;(1).<br />
    THE&nbsp;FOLLOWING&nbsp;INSTRUMENT&nbsp;DEPARTURE&nbsp;PROCEDURES&nbsp;MAY&nbsp;BE&nbsp;FLOWN&nbsp;AT&nbsp;NIGHT<br />
    BY&nbsp;CIVIL&nbsp;AVIATION&nbsp;AUTHORITY&nbsp;NEW&nbsp;ZEALAND&nbsp;APPROVED&nbsp;OPERATORS&nbsp;ONLY:<br />
    NELSON&nbsp;RWY&nbsp;02&nbsp;ZULU&nbsp;ONE&nbsp;DEPARTURE&nbsp;(ZULU1)<br />
    NELSON&nbsp;RWY&nbsp;02&nbsp;XRAY&nbsp;ONE&nbsp;DEPARTURE&nbsp;(XRAY1)<br />
    AIP&nbsp;WILL&nbsp;BE&nbsp;AMENDED.<br /><br /></span

  ><span class="notamSeries">B6816/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;04 DEC 2019
    11:00&nbsp;&nbsp;TO:&nbsp;&nbsp;01 JAN 2020 11:00&nbsp; <br /></span
  ><span class="notamText"
    >AMEND&nbsp;APP/TWR/FIS&nbsp;HR&nbsp;SER:<br />
    0545-2205&nbsp;MON-FRI<br />
    0545-1910&nbsp;SAT<br />
    0710-2205&nbsp;SUN<br />
    HR&nbsp;IN&nbsp;NEW&nbsp;ZEALAND&nbsp;DAYLIGHT&nbsp;TIME&nbsp;(NZDT)<br />
    NZDT&nbsp;IS&nbsp;13&nbsp;HR&nbsp;AHEAD&nbsp;OF&nbsp;UTC<br />
    REF&nbsp;AIP&nbsp;SUP&nbsp;2/19<br /><br /></span

  ><span class="notamSeries">B7018/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;30 NOV 2019
    20:34&nbsp;&nbsp;TO:&nbsp;&nbsp;31 JAN 2020 20:00&nbsp; EST<br /></span
  ><span class="notamText">ACFT&nbsp;STAND&nbsp;5&nbsp;CLSD<br /><br /></span
  ><span class="notamLocation">NZWN (WELLINGTON) </span><br /><br /><span
    class="notamSeries"
    >B1954/18</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;10 APR 2018
    02:00&nbsp;&nbsp;TO:&nbsp;&nbsp;PERM<br /></span
  ><span class="notamText"
    >TWR/FIS&nbsp;125.25&nbsp;MHZ&nbsp;'WELLINGTON&nbsp;TWR'&nbsp;A/G&nbsp;FAC&nbsp;OPR&nbsp;-&nbsp;NEW&nbsp;FAC.<br />
    REPLACES&nbsp;TWR/FIS&nbsp;A/G&nbsp;FAC&nbsp;120.0&nbsp;MHZ<br /><br /></span
  ><span class="notamSeries">B5925/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;06 NOV 2019
    11:00&nbsp;&nbsp;TO:&nbsp;&nbsp;29 JAN 2020 11:00&nbsp; <br /></span
  ><span class="notamText"
    >REF&nbsp;AIP&nbsp;NZWN&nbsp;AD&nbsp;2-62.12&nbsp;NZWN&nbsp;RNAV&nbsp;(RNP)&nbsp;SID&nbsp;RWY&nbsp;34&nbsp;(2)<br />
    EFFECTIVE&nbsp;7&nbsp;NOV&nbsp;19.<br />
    AMD&nbsp;HEADER&nbsp;FROM&nbsp;CAT&nbsp;A,B,C,D&nbsp;TO&nbsp;CAT&nbsp;C.<br />
    ADD&nbsp;LABEL&nbsp;'FOR&nbsp;OPERATORS&nbsp;WITH&nbsp;CAANZ&nbsp;RNP-AR&nbsp;SPECIAL&nbsp;DESIGN&nbsp;CRITERIA<br />
    APPROVAL&nbsp;ONLY'<br /><br /></span

  ><span class="notamSeries">B6485/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;06 NOV 2019
    11:00&nbsp;&nbsp;TO:&nbsp;&nbsp;PERM<br /></span
  ><span class="notamText"
    >REF&nbsp;AIP&nbsp;NZWN&nbsp;AD&nbsp;2-62.12&nbsp;RNAV&nbsp;(RNP)&nbsp;SID&nbsp;RWY&nbsp;34&nbsp;(2)&nbsp;DATED&nbsp;7&nbsp;NOV&nbsp;19.&nbsp;<br />
    POLAX4R&nbsp;DEP&nbsp;-&nbsp;FIRST&nbsp;TWO&nbsp;BULLET&nbsp;POINTS&nbsp;AMEND&nbsp;WPT&nbsp;LAXEV&nbsp;TO&nbsp;READ<br />
    LAXIV.<br /><br /></span

  ><span class="notamSeries">B6490/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;06 NOV 2019
    11:00&nbsp;&nbsp;TO:&nbsp;&nbsp;06 FEB 2020 20:00&nbsp; EST<br /></span
  ><span class="notamText"
    >ACFT&nbsp;REQUESTING&nbsp;A&nbsp;VISUAL&nbsp;APCH&nbsp;CAN&nbsp;EXPECT&nbsp;CLR&nbsp;ROUTING&nbsp;FOR&nbsp;A<br />
    VISUAL&nbsp;APCH&nbsp;VIA:&nbsp;RIDGE&nbsp;FOR&nbsp;RWY&nbsp;16&nbsp;OR&nbsp;6NM&nbsp;FINAL&nbsp;FOR&nbsp;RWY&nbsp;34<br /><br /></span
  ><span class="notamLocation">NZWS (WESTPORT) </span><br /><br /><span
    class="notamSeries"
    >A2791/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;23 SEP 2019
    02:15&nbsp;&nbsp;TO:&nbsp;&nbsp;PERM<br /></span
  ><span class="notamText"
    >REF&nbsp;AIP&nbsp;NZWS&nbsp;AD&nbsp;2-52.1&nbsp;NZWS&nbsp;OPERATIONAL&nbsp;DATA&nbsp;EFFECTIVE&nbsp;13&nbsp;SEP&nbsp;18.<br />
    UNDER&nbsp;LIGHTING&nbsp;AMEND&nbsp;RWY&nbsp;04/22&nbsp;APAPI&nbsp;FM&nbsp;3.05&nbsp;TO&nbsp;3.0&nbsp;DEGREES<br /><br /></span
  ><span class="notamSeries">A3578/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;29 NOV 2019
    06:00&nbsp;&nbsp;TO:&nbsp;&nbsp;31 JAN 2020 18:00&nbsp; <br /></span
  ><span class="notamText"
    >DAILY 0600-1800<br />LASER&nbsp;DISPLAY&nbsp;WILL&nbsp;TAKE&nbsp;PLACE&nbsp;AT&nbsp;41&nbsp;45&nbsp;13.5&nbsp;S&nbsp;171&nbsp;35&nbsp;55.2&nbsp;E&nbsp;<br />
    (WESTPORT&nbsp;CLOCK&nbsp;TOWER)&nbsp;APRX&nbsp;1.2NM&nbsp;SE&nbsp;NZWS<br />
    LOWER:&nbsp;SFC&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UPPER:&nbsp;500FT AGL<br /><br /></span
  ><span class="notamSeries">A3647/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;27 NOV 2019
    17:00&nbsp;&nbsp;TO:&nbsp;&nbsp;31 JAN 2020 09:00&nbsp; <br /></span
  ><span class="notamText"
    >DAILY 1700-0900<br />WIP&nbsp;ON&nbsp;BREAKWATER&nbsp;VICINITY&nbsp;AD&nbsp;BOUNDARY.&nbsp;MEN&nbsp;AND&nbsp;EQPT&nbsp;OPR<br /><br /></span
  ><span class="notamLocation">NZKI (KAIKOURA) </span><br /><br /><span
    class="notamSeries"
    >A3762/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;05 DEC 2019
    04:15&nbsp;&nbsp;TO:&nbsp;&nbsp;20 DEC 2019 00:00&nbsp; EST<br /></span
  ><span class="notamText"
    >GRASS&nbsp;AREA&nbsp;ADJ&nbsp;HANGAR&nbsp;SOUTHWEST&nbsp;OF&nbsp;AIR&nbsp;BP&nbsp;FUEL&nbsp;PUMP&nbsp;CLSD,&nbsp;MARKED&nbsp;<br />
    WITH&nbsp;CONES<br /><br /></span
  ><span class="notamLocation">NZGM (GREYMOUTH) </span><br /><br /><span
    class="notamSeries"
    >A3215/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;25 OCT 2019
    02:42&nbsp;&nbsp;TO:&nbsp;&nbsp;PERM<br /></span
  ><span class="notamText"
    >REF&nbsp;AIP&nbsp;NZGM&nbsp;AD&nbsp;2-52.1&nbsp;OPERATIONAL&nbsp;DATA.&nbsp;(LIGHTING)<br />
    AMEND&nbsp;PAL&nbsp;FREQ&nbsp;119.1&nbsp;TO&nbsp;READ&nbsp;119.8<br /><br /></span
  ><span class="notamSeries">A3725/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;03 DEC 2019
    20:00&nbsp;&nbsp;TO:&nbsp;&nbsp;08 DEC 2019 04:00&nbsp; <br /></span
  ><span class="notamText"
    >DAILY 2000-0400<br />REMOTELY&nbsp;PILOTED&nbsp;ACFT&nbsp;ACT&nbsp;WILL&nbsp;TAKE&nbsp;PLACE&nbsp;WI&nbsp;200M&nbsp;RADIUS&nbsp;OF&nbsp;THE&nbsp;<br />
    FLW&nbsp;LOCATIONS:<br />
    42&nbsp;27&nbsp;11&nbsp;S&nbsp;171&nbsp;11&nbsp;29&nbsp;E&nbsp;APRX&nbsp;955M&nbsp;N&nbsp;NZGM&nbsp;<br />
    42&nbsp;28&nbsp;47&nbsp;S&nbsp;171&nbsp;10&nbsp;56&nbsp;E&nbsp;APRX&nbsp;1.2NM&nbsp;S&nbsp;NZGM&nbsp;<br />
    MAX&nbsp;HGT&nbsp;280FT&nbsp;AGL.&nbsp;OPR&nbsp;CTC&nbsp;TEL&nbsp;021&nbsp;084&nbsp;55110<br /><br /></span

  ><span class="notamLocation">NZWL (WEST MELTON) </span><br /><br /><span
    class="notamSeries"
    >A2339/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;14 AUG 2019
    22:00&nbsp;&nbsp;TO:&nbsp;&nbsp;14 DEC 2019 19:00&nbsp; EST<br /></span
  ><span class="notamText"
    >GRASS&nbsp;RWY&nbsp;04/22&nbsp;CLOSED<br /><br /></span
  ><span class="notamLocation">NZCH (CHRISTCHURCH) </span><br /><br /><span
    class="notamSeries"
    >B6912/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;29 NOV 2019
    07:30&nbsp;&nbsp;TO:&nbsp;&nbsp;30 DEC 2019 11:00&nbsp; <br /></span
  ><span class="notamText"
    >DAILY 0730-1100<br />SEARCHLIGHT&nbsp;DISPLAY&nbsp;WILL&nbsp;TAKE&nbsp;PLACE&nbsp;AT&nbsp;43&nbsp;34&nbsp;32&nbsp;S&nbsp;172&nbsp;29&nbsp;31&nbsp;E<br />
    (PREBBLETON)&nbsp;APRX&nbsp;5.6NM&nbsp;S&nbsp;NZCH<br />
    LOWER:&nbsp;SFC&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UPPER:&nbsp;UNL<br /><br /></span
  ><span class="notamSeries">B7056/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;02 DEC 2019
    04:48&nbsp;&nbsp;TO:&nbsp;&nbsp;03 MAR 2020 01:00&nbsp; EST<br /></span
  ><span class="notamText"
    >REF&nbsp;AIP&nbsp;NZCH&nbsp;AD&nbsp;2-45.5<br />
    NZCH&nbsp;RNAV&nbsp;(RNP)&nbsp;X&nbsp;RWY&nbsp;02&nbsp;EFFECTIVE&nbsp;24&nbsp;MAY&nbsp;18.&nbsp;<br />
    RNAV&nbsp;(RNP)&nbsp;X&nbsp;RWY&nbsp;02&nbsp;APPROACH&nbsp;PROCEDURE&nbsp;NOT&nbsp;AVBL<br /><br /></span

  ><span class="notamSeries">B7055/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;02 DEC 2019
    04:43&nbsp;&nbsp;TO:&nbsp;&nbsp;PERM<br /></span
  ><span class="notamText"
    >REF&nbsp;AIP&nbsp;NZCH&nbsp;AD&nbsp;2-41.1&nbsp;ILS/DME&nbsp;OR&nbsp;LOC/DME&nbsp;RWY&nbsp;02<br />
    NZCH&nbsp;AD&nbsp;2-41.2&nbsp;ILS/DME&nbsp;OR&nbsp;LOC/DME&nbsp;RWY&nbsp;20<br />
    NZCH&nbsp;AD&nbsp;2-43.1&nbsp;VOR/DME&nbsp;RWY&nbsp;02<br />
    NZCH&nbsp;AD&nbsp;2-43.2&nbsp;VOR/DME&nbsp;RWY&nbsp;20<br />
    NZCH&nbsp;AD&nbsp;2-45.1&nbsp;RNAV&nbsp;(GNSS)&nbsp;Z&nbsp;RWY&nbsp;02<br />
    NZCH&nbsp;AD&nbsp;2-45.2&nbsp;RNAV&nbsp;(GNSS)&nbsp;Z&nbsp;RWY&nbsp;20<br />
    NZCH&nbsp;AD&nbsp;2-45.10&nbsp;RNAV&nbsp;(GNSS)&nbsp;RWY&nbsp;11<br />
    NZCH&nbsp;AD&nbsp;2-70.1Y&nbsp;ILS/DME&nbsp;N&nbsp;OR&nbsp;LOC/DME&nbsp;N&nbsp;RWY&nbsp;02<br />
    NZCH&nbsp;AD&nbsp;2-70.2Y&nbsp;VOR/DME&nbsp;N&nbsp;RWY&nbsp;02<br />
    NZCH&nbsp;AD&nbsp;2-70.3Y&nbsp;RNAV&nbsp;(GNSS)&nbsp;N&nbsp;RWY&nbsp;02<br />
    NZCH&nbsp;AD&nbsp;2-70.21Y&nbsp;LOC/DME&nbsp;S&nbsp;RWY&nbsp;02<br />
    NZCH&nbsp;AD&nbsp;2-70.22Y&nbsp;ILS/DME&nbsp;S&nbsp;OR&nbsp;LOC/DME&nbsp;S&nbsp;RWY&nbsp;20<br />
    NZCH&nbsp;AD&nbsp;2-70.23Y&nbsp;VOR/DME&nbsp;S&nbsp;RWY&nbsp;02<br />
    NZCH&nbsp;AD&nbsp;2-70.24Y&nbsp;VOR/DME&nbsp;S&nbsp;RWY&nbsp;20<br />
    NZCH&nbsp;AD&nbsp;2-70.25Y&nbsp;RNAV&nbsp;(GNSS)&nbsp;S&nbsp;RWY&nbsp;20<br />
    CIRCLING&nbsp;MINIMA&nbsp;RAISED&nbsp;AS&nbsp;FLW:<br />
    CAT&nbsp;D&nbsp;820&nbsp;(697)&nbsp;4600<br /><br /></span

  ><span class="notamLocation">NZHT (HAAST) </span><br /><br /><span
    class="notamSeries"
    >A2809/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;24 SEP 2019
    23:34&nbsp;&nbsp;TO:&nbsp;&nbsp;PERM<br /></span
  ><span class="notamText"
    >REF&nbsp;AIP&nbsp;NZHT&nbsp;AD&nbsp;2-52.1&nbsp;HAAST&nbsp;OPERATIONAL&nbsp;DATA<br />
    AMEND&nbsp;FACILITIES<br />
    FUEL:&nbsp;R&nbsp;D&nbsp;PETROLEUM&nbsp;AVGAS&nbsp;100&nbsp;AND&nbsp;JET&nbsp;A1&nbsp;FUEL<br /><br /></span

  ><span class="notamSeries">A3671/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;28 NOV 2019
    19:43&nbsp;&nbsp;TO:&nbsp;&nbsp;23 DEC 2019 00:00&nbsp; EST<br /></span
  ><span class="notamText"
    >AREA&nbsp;CLOSED&nbsp;EAST&nbsp;THR&nbsp;RWY&nbsp;16&nbsp;DUE&nbsp;SOFT&nbsp;SFC,&nbsp;MARKED&nbsp;BY&nbsp;CONES<br /><br /></span
  ><span class="notamLocation">NZAS (ASHBURTON) </span><br /><br /><span
    class="notamSeries"
    >A3474/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;15 NOV 2019
    23:27&nbsp;&nbsp;TO:&nbsp;&nbsp;15 DEC 2019 23:00&nbsp; EST<br /></span
  ><span class="notamText"
    >GRASS&nbsp;TWY&nbsp;ADJ&nbsp;GRASS&nbsp;RWY&nbsp;02/20&nbsp;CLSD.<br />
    GRASS&nbsp;TWY&nbsp;BTN&nbsp;GRASS&nbsp;RUNWAYS&nbsp;02/20&nbsp;AND&nbsp;16/34&nbsp;REDUCED&nbsp;WIDTH.<br />
    AREA&nbsp;MARKED&nbsp;BY&nbsp;CONES<br /><br /></span

  ><span class="notamSeries">A3551/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;07 DEC 2019
    08:30&nbsp;&nbsp;TO:&nbsp;&nbsp;07 DEC 2019 09:00&nbsp; <br /></span
  ><span class="notamText"
    >FIREWORKS&nbsp;DISPLAY&nbsp;WILL&nbsp;TAKE&nbsp;PLACE&nbsp;AT&nbsp;43&nbsp;53&nbsp;48&nbsp;S&nbsp;171&nbsp;44&nbsp;52&nbsp;E,<br />
    (ASHBURTON&nbsp;DOMAIN)&nbsp;APRX&nbsp;2.1NM&nbsp;W&nbsp;NZAS<br />
    LOWER:&nbsp;SFC&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UPPER:&nbsp;1000FT
    AMSL<br /><br /></span
  ><span class="notamLocation">NZTL (TEKAPO) </span><br /><br /><span
    class="notamSeries"
    >A3153/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;28 OCT 2019
    16:30&nbsp;&nbsp;TO:&nbsp;&nbsp;28 JAN 2020 09:14&nbsp; <br /></span
  ><span class="notamText"
    >MON-FRI SR MINUS30-SS PLUS30<br />REMOTELY&nbsp;PILOTED&nbsp;ACFT&nbsp;ACT&nbsp;WILL&nbsp;TAKE&nbsp;PLACE&nbsp;WI&nbsp;2.2NM&nbsp;RADIUS&nbsp;AND&nbsp;UP&nbsp;<br />
    TO&nbsp;6NM&nbsp;S&nbsp;NZTL<br />
    LOWER:&nbsp;SFC&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UPPER:&nbsp;3000FT AGL<br /><br /></span
  ><span class="notamLocation">NZUK (PUKAKI) </span><br /><br /><span
    class="notamSeries"
    >A3720/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;04 DEC 2019
    11:00&nbsp;&nbsp;TO:&nbsp;&nbsp;PERM<br /></span
  ><span class="notamText"
    >REFER&nbsp;SUP&nbsp;80/19&nbsp;&nbsp;PUKAKI&nbsp;-&nbsp;NZP910&nbsp;ESTABLISHMENT<br />
    EFFECTIVE&nbsp;5&nbsp;DEC&nbsp;19.&nbsp;<br />
    AMD&nbsp;LOCATION&nbsp;TO&nbsp;S&nbsp;44&nbsp;15&nbsp;01.8&nbsp;E&nbsp;170&nbsp;07&nbsp;04.6<br /><br /></span

  ><span class="notamLocation">NZTU (TIMARU) </span><br /><br /><span
    class="notamSeries"
    >A3655/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;27 NOV 2019
    23:00&nbsp;&nbsp;TO:&nbsp;&nbsp;30 JAN 2020 23:00&nbsp; <br /></span
  ><span class="notamText"
    >GRASS&nbsp;RWY&nbsp;11/29&nbsp;RESTRICTED&nbsp;TO&nbsp;30M&nbsp;WIDE&nbsp;MOWN&nbsp;STRIPS&nbsp;ON&nbsp;EITHER&nbsp;SIDE<br />
    OF&nbsp;RWY&nbsp;DUE&nbsp;SFC&nbsp;COND&nbsp;OF&nbsp;CENTRE<br /><br /></span
  ><span class="notamLocation">NZOA (OMARAMA) </span><br /><br /><span
    class="notamSeries"
    >A2938/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;06 OCT 2019
    19:56&nbsp;&nbsp;TO:&nbsp;&nbsp;31 DEC 2019 19:00&nbsp; <br /></span
  ><span class="notamText"
    >NEW&nbsp;WINCH&nbsp;LAUNCH&nbsp;RWY&nbsp;DEVELOPMENTS&nbsp;WILL&nbsp;TAKE&nbsp;PLACE&nbsp;NE&nbsp;OF<br />
    GRASS&nbsp;RWY&nbsp;27R&nbsp;AND&nbsp;N&nbsp;OF&nbsp;GRASS&nbsp;RWY&nbsp;09L.&nbsp;ROUGH&nbsp;GROUND,&nbsp;DO&nbsp;NOT&nbsp;LAND.<br /><br /></span
  ><span class="notamLocation">NZMF (MILFORD SOUND) </span><br /><br /><span
    class="notamSeries"
    >A3148/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;22 OCT 2019
    19:00&nbsp;&nbsp;TO:&nbsp;&nbsp;21 JAN 2020 03:30&nbsp; EST<br /></span
  ><span class="notamText"
    >AMEND&nbsp;AFIS&nbsp;HR&nbsp;SER:<br />
    0800-1630&nbsp;DAILY.<br />
    HR&nbsp;IN&nbsp;NEW&nbsp;ZEALAND&nbsp;DAYLIGHT&nbsp;TIME&nbsp;(NZDT)&nbsp;NZDT&nbsp;IS&nbsp;13&nbsp;HR&nbsp;AHEAD&nbsp;OF&nbsp;UTC.<br />
    REF&nbsp;AIP&nbsp;SUP&nbsp;2/19<br /><br /></span

  ><span class="notamLocation">NZWF (WANAKA) </span><br /><br /><span
    class="notamSeries"
    >B6087/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;17 OCT 2019
    19:31&nbsp;&nbsp;TO:&nbsp;&nbsp;PERM<br /></span
  ><span class="notamText"
    >REF&nbsp;AIP&nbsp;NZWF&nbsp;AD&nbsp;2-33.1&nbsp;RNAV&nbsp;(GNSS)&nbsp;STAR&nbsp;RWY&nbsp;29&nbsp;EFFECTIVE&nbsp;7&nbsp;NOV&nbsp;19<br />
    QN&nbsp;ONE&nbsp;ECHO&nbsp;ARRIVAL.&nbsp;AMEND&nbsp;WPT&nbsp;OSLOT&nbsp;TO&nbsp;READ&nbsp;OLSOT<br /><br /></span
  ><span class="notamLocation">NZQN (QUEENSTOWN) </span><br /><br /><span
    class="notamSeries"
    >B5096/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;28 AUG 2019
    23:33&nbsp;&nbsp;TO:&nbsp;&nbsp;31 DEC 2019 00:00&nbsp; EST<br /></span
  ><span class="notamText">TWY&nbsp;A3&nbsp;LGT&nbsp;U/S<br /><br /></span
  ><span class="notamSeries">B6409/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;02 NOV 2019
    22:01&nbsp;&nbsp;TO:&nbsp;&nbsp;31 JAN 2020 05:00&nbsp; <br /></span
  ><span class="notamText"
    >0700&nbsp;TO&nbsp;1800&nbsp;MON-SAT&nbsp;NEW&nbsp;ZEALAND&nbsp;DAYLIGHT&nbsp;TIME.&nbsp;CRANES&nbsp;OPR&nbsp;200M<br />
    SE&nbsp;THR&nbsp;RWY&nbsp;32.&nbsp;MAX&nbsp;HGT&nbsp;123FT&nbsp;AGL.&nbsp;BOOMS&nbsp;WILL&nbsp;BE&nbsp;LOWERED&nbsp;AT&nbsp;NIGHT<br /><br /></span
  ><span class="notamSeries">B7058/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;02 DEC 2019
    05:56&nbsp;&nbsp;TO:&nbsp;&nbsp;02 JAN 2020 05:30&nbsp; <br /></span
  ><span class="notamText"
    >TWY&nbsp;Y,&nbsp;ADJ&nbsp;HELIWORKS,&nbsp;POTHOLE&nbsp;40&nbsp;CENTIMETRES&nbsp;BY&nbsp;60&nbsp;CENTIMETRES&nbsp;<br />
    DEPTH&nbsp;5&nbsp;MILLIMETRES.&nbsp;MARKED&nbsp;BY&nbsp;FLUORESCENT&nbsp;PAINT<br /><br /></span
  ><span class="notamSeries">B7162/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;06 DEC 2019
    21:35&nbsp;&nbsp;TO:&nbsp;&nbsp;07 DEC 2019 03:00&nbsp; EST<br /></span
  ><span class="notamText"
    >RWY&nbsp;05/23&nbsp;WATER&nbsp;PATCHES&nbsp;IN&nbsp;WHEEL&nbsp;RUTS&nbsp;WEST&nbsp;OF&nbsp;TWY&nbsp;C,&nbsp;MAX&nbsp;DEPTH&nbsp;10<br />
    MILLIMETRES<br /><br /></span
  ><span class="notamSeries">B7163/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;06 DEC 2019
    22:00&nbsp;&nbsp;TO:&nbsp;&nbsp;08 DEC 2019 22:00&nbsp; <br /></span
  ><span class="notamText"
    >AIR&nbsp;BP&nbsp;JET&nbsp;A1,&nbsp;AVGAS,&nbsp;SWIPECARD&nbsp;FUEL&nbsp;NOT&nbsp;AVBL<br /><br /></span
  ><span class="notamLocation">NZMO (TE ANAU / MANAPOURI) </span
  ><br /><br /><span class="notamSeries">A3066/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;16 OCT 2019
    02:41&nbsp;&nbsp;TO:&nbsp;&nbsp;PERM<br /></span
  ><span class="notamText"
    >AD&nbsp;NOW&nbsp;CAA&nbsp;RULE&nbsp;PART&nbsp;139&nbsp;CERTIFICATED.<br /><br /></span
  ><span class="notamSeries">A3067/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;16 OCT 2019
    02:45&nbsp;&nbsp;TO:&nbsp;&nbsp;PERM<br /></span
  ><span class="notamText"
    >REF&nbsp;AIP&nbsp;NZMO&nbsp;AD&nbsp;2-52.1&nbsp;OPR&nbsp;DATA&nbsp;EFFECTIVE&nbsp;28&nbsp;MAR&nbsp;19.<br />
    AMD&nbsp;RWY&nbsp;08/26&nbsp;STRENGTH&nbsp;FROM&nbsp;PCN&nbsp;20&nbsp;TO&nbsp;PCN&nbsp;14.<br /><br /></span
  ><span class="notamLocation">NZTI (TAIERI) </span><br /><br /><span
    class="notamSeries"
    >A3480/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;17 NOV 2019
    00:14&nbsp;&nbsp;TO:&nbsp;&nbsp;16 DEC 2019 19:00&nbsp; <br /></span
  ><span class="notamText"
    >GRASS&nbsp;TWY&nbsp;NORTH-EAST&nbsp;OF&nbsp;GRASS&nbsp;RWY&nbsp;11/29&nbsp;CLSD&nbsp;SFC&nbsp;COND.<br />
    GRASS&nbsp;TWY&nbsp;SOUTH-EAST&nbsp;OF&nbsp;GRASS&nbsp;RWY&nbsp;05/23&nbsp;SFC&nbsp;COND&nbsp;SOFT<br /><br /></span
  ><span class="notamSeries">A3576/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;24 NOV 2019
    18:00&nbsp;&nbsp;TO:&nbsp;&nbsp;24 JAN 2020 04:00&nbsp; EST<br /></span
  ><span class="notamText"
    >UNPUBLISHED&nbsp;GRASS&nbsp;TWY&nbsp;NORTH&nbsp;GRASS&nbsp;RWY&nbsp;05/23&nbsp;200&nbsp;MILLIMETRE&nbsp;DROP&nbsp;<br />
    ALONG&nbsp;GRASS&nbsp;TWY&nbsp;EDGES&nbsp;DUE&nbsp;WIP,&nbsp;ACFT&nbsp;SHALL&nbsp;NOT&nbsp;ENTER&nbsp;FROM&nbsp;THE&nbsp;EDGES.&nbsp;<br />
    200&nbsp;MILLIMETRE&nbsp;DROP&nbsp;MARKED&nbsp;BY&nbsp;TAPE<br /><br /></span

  ><span class="notamLocation">NZDN (DUNEDIN) </span><br /><br /><span
    class="notamSeries"
    >B6262/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;27 OCT 2019
    17:00&nbsp;&nbsp;TO:&nbsp;&nbsp;13 DEC 2019 08:45&nbsp; <br /></span
  ><span class="notamText"
    >AMEND&nbsp;APP/TWR/FIS&nbsp;HR&nbsp;SER:<br />
    0600-2045&nbsp;MON<br />
    0600-0055&nbsp;TUE<br />
    0600-2145&nbsp;WED<br />
    0600-0055&nbsp;THU<br />
    0600-2145&nbsp;FRI<br />
    0610-1910&nbsp;SAT<br />
    0810-0055&nbsp;SUN<br />
    HR&nbsp;IN&nbsp;NEW&nbsp;ZEALAND&nbsp;DAYLIGHT&nbsp;TIME&nbsp;(NZDT)<br />
    NZDT&nbsp;IS&nbsp;13&nbsp;HR&nbsp;AHEAD&nbsp;OF&nbsp;UTC<br />
    REF&nbsp;AIP&nbsp;SUP&nbsp;2/19<br /><br /></span

  ><span class="notamSeries">B6762/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;19 NOV 2019
    11:55&nbsp;&nbsp;TO:&nbsp;&nbsp;01 JAN 2020 11:00&nbsp; <br /></span
  ><span class="notamText"
    >REF&nbsp;AIP&nbsp;NZDN&nbsp;AD&nbsp;2-52.1&nbsp;NZDN&nbsp;OPERATIONAL&nbsp;DATA&nbsp;(1)<br />
    AMEND&nbsp;LIGHTING&nbsp;SECTION&nbsp;TO&nbsp;READ:<br />
    OUTSIDE&nbsp;OF&nbsp;DUNEDIN&nbsp;TOWER&nbsp;HOURS&nbsp;OF&nbsp;SERVICE,&nbsp;REMOTE&nbsp;CONTROL&nbsp;OF&nbsp;AD<br />
    LIGHTING&nbsp;AVBL&nbsp;FROM&nbsp;CHRISTCHURCH&nbsp;CONTROL&nbsp;ON&nbsp;FREQ&nbsp;129.3&nbsp;MHZ&nbsp;OR<br />
    TEL&nbsp;0800&nbsp;626&nbsp;756&nbsp;(LANDLINE)&nbsp;OR&nbsp;+64&nbsp;3&nbsp;358&nbsp;1509&nbsp;(CELLPHONE&nbsp;USERS)<br />
    ADVISING&nbsp;RWY&nbsp;TO&nbsp;BE&nbsp;USED.&nbsp;BRILLIANCE&nbsp;ADJUSTMENTS&nbsp;MAY&nbsp;TAKE&nbsp;UP&nbsp;TO&nbsp;<br />
    ONE&nbsp;MINUTE&nbsp;TO&nbsp;ACTION.&nbsp;ADVISE&nbsp;CHRISTCHURCH&nbsp;CONTROL&nbsp;WHEN&nbsp;<br />
    REQUIREMENTS&nbsp;COMPLETE<br /><br /></span

  ><span class="notamLocation">NZBA (BALCLUTHA) </span><br /><br /><span
    class="notamSeries"
    >A3767/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;05 DEC 2019
    21:10&nbsp;&nbsp;TO:&nbsp;&nbsp;09 DEC 2019 00:00&nbsp; EST<br /></span
  ><span class="notamText">AD&nbsp;CLSD&nbsp;DUE&nbsp;FLOODING<br /><br /></span
  ><span class="notamLocation">NZNV (INVERCARGILL) </span><br /><br /><span
    class="notamSeries"
    >B6858/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;22 NOV 2019
    02:30&nbsp;&nbsp;TO:&nbsp;&nbsp;PERM<br /></span
  ><span class="notamText"
    >REF&nbsp;AIP&nbsp;NZNV&nbsp;AD&nbsp;2-62.2&nbsp;RNAV&nbsp;(GNSS)&nbsp;SID&nbsp;RWY&nbsp;22&nbsp;DATED&nbsp;7&nbsp;NOV&nbsp;19.<br />
    AMVIX2Q&nbsp;DEP&nbsp;AMEND&nbsp;SECOND&nbsp;BULLET&nbsp;POINT&nbsp;TO&nbsp;READ&nbsp;TURN&nbsp;LEFT,&nbsp;DIRECT&nbsp;TO<br />
    AMVIX,&nbsp;MAX&nbsp;IAS&nbsp;240&nbsp;KT&nbsp;UNTIL&nbsp;TURN&nbsp;COMPLETE.<br /><br /></span

  ><span class="notamNoInfoHeader">
    NO NOTAM MATCHING THE QUERY FOR THE FOLLOWING LOCATIONS: </span
  ><br /><br /><span class="notamNoInfoList">NZKK&nbsp; </span
  ><span class="notamNoInfoList">NZKO&nbsp; </span
  ><span class="notamNoInfoList">NZDA&nbsp; </span
  ><span class="notamNoInfoList">NZRW&nbsp; </span
  ><span class="notamNoInfoList">NZOX&nbsp; </span
  ><span class="notamNoInfoList">NZKD&nbsp; </span
  ><span class="notamNoInfoList">NZSL&nbsp; </span
  ><span class="notamNoInfoList">NZOF&nbsp; </span
  ><span class="notamNoInfoList">NZPI&nbsp; </span
  ><span class="notamNoInfoList">NZKE&nbsp; </span
  ><span class="notamNoInfoList">NZWT&nbsp; </span
  ><span class="notamNoInfoList">NZAW&nbsp; </span
  ><span class="notamNoInfoList">NZUN&nbsp; </span
  ><span class="notamNoInfoList">NZME&nbsp; </span
  ><span class="notamNoInfoList">NZWV&nbsp; </span
  ><span class="notamNoInfoList">NZMA&nbsp; </span
  ><span class="notamNoInfoList">NZTE&nbsp; </span
  ><span class="notamNoInfoList">NZRA&nbsp; </span
  ><span class="notamNoInfoList">NZOP&nbsp; </span
  ><span class="notamNoInfoList">NZRL&nbsp; </span
  ><span class="notamNoInfoList">NZES&nbsp; </span
  ><span class="notamNoInfoList">NZTO&nbsp; </span
  ><span class="notamNoInfoList">NZGA&nbsp; </span
  ><span class="notamNoInfoList">NZGS&nbsp; </span
  ><span class="notamNoInfoList">NZCG&nbsp; </span
  ><span class="notamNoInfoList">NZLT&nbsp; </span
  ><span class="notamNoInfoList">NZRK&nbsp; </span
  ><span class="notamNoInfoList">NZTN&nbsp; </span
  ><span class="notamNoInfoList">NZWO&nbsp; </span
  ><span class="notamNoInfoList">NZNP&nbsp; </span
  ><span class="notamNoInfoList">NZNF&nbsp; </span
  ><span class="notamNoInfoList">NZSD&nbsp; </span
  ><span class="notamNoInfoList">NZHA&nbsp; </span
  ><span class="notamNoInfoList">NZVR&nbsp; </span
  ><span class="notamNoInfoList">NZKY&nbsp; </span
  ><span class="notamNoInfoList">NZFL&nbsp; </span
  ><span class="notamNoInfoList">NZYP&nbsp; </span
  ><span class="notamNoInfoList">NZDV&nbsp; </span
  ><span class="notamNoInfoList">NZFI&nbsp; </span
  ><span class="notamNoInfoList">NZFP&nbsp; </span
  ><span class="notamNoInfoList">NZKP&nbsp; </span
  ><span class="notamNoInfoList">NZTK&nbsp; </span
  ><span class="notamNoInfoList">NZPW&nbsp; </span
  ><span class="notamNoInfoList">NZMK&nbsp; </span
  ><span class="notamNoInfoList">NZKM&nbsp; </span
  ><span class="notamNoInfoList">NZFT&nbsp; </span
  ><span class="notamNoInfoList">NZPN&nbsp; </span
  ><span class="notamNoInfoList">NZCL&nbsp; </span
  ><span class="notamNoInfoList">NZWB&nbsp; </span
  ><span class="notamNoInfoList">NZOM&nbsp; </span
  ><span class="notamNoInfoList">NZLE&nbsp; </span
  ><span class="notamNoInfoList">NZMR&nbsp; </span
  ><span class="notamNoInfoList">NZHP&nbsp; </span
  ><span class="notamNoInfoList">NZHK&nbsp; </span
  ><span class="notamNoInfoList">NZLA&nbsp; </span
  ><span class="notamNoInfoList">NZRT&nbsp; </span
  ><span class="notamNoInfoList">NZFE&nbsp; </span
  ><span class="notamNoInfoList">NZML&nbsp; </span
  ><span class="notamNoInfoList">NZFJ&nbsp; </span
  ><span class="notamNoInfoList">NZWY&nbsp; </span
  ><span class="notamNoInfoList">NZSF&nbsp; </span
  ><span class="notamNoInfoList">NZFF&nbsp; </span
  ><span class="notamNoInfoList">NZFO&nbsp; </span
  ><span class="notamNoInfoList">NZPH&nbsp; </span
  ><span class="notamNoInfoList">NZMC&nbsp; </span
  ><span class="notamNoInfoList">NZGT&nbsp; </span
  ><span class="notamNoInfoList">NZRI&nbsp; </span
  ><span class="notamNoInfoList">NZMW&nbsp; </span
  ><span class="notamNoInfoList">NZMJ&nbsp; </span
  ><span class="notamNoInfoList">NZWM&nbsp; </span
  ><span class="notamNoInfoList">NZGY&nbsp; </span
  ><span class="notamNoInfoList">NZOU&nbsp; </span
  ><span class="notamNoInfoList">NZCW&nbsp; </span
  ><span class="notamNoInfoList">NZCS&nbsp; </span
  ><span class="notamNoInfoList">NZLX&nbsp; </span
  ><span class="notamNoInfoList">NZRX&nbsp; </span
  ><span class="notamNoInfoList">NZVL&nbsp; </span
  ><span class="notamNoInfoList">NZCB&nbsp; </span
  ><span class="notamNoInfoList">NZGC&nbsp; </span
  ><span class="notamNoInfoList">NZRC&nbsp; </span><br /><br /><br /><span
    class="enrouteLabel"
    ><b>EN-ROUTE</b></span
  ><br /><br /><span class="notamSeries">B6332/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;30 OCT 2019
    03:26&nbsp;&nbsp;TO:&nbsp;&nbsp;20 DEC 2019 00:00&nbsp; EST<br /></span
  ><span class="notamText"
    >REF&nbsp;AIP&nbsp;ENR&nbsp;1.5-34<br />
    4.17&nbsp;INSTRUMENT&nbsp;APPROACH&nbsp;PROCEDURES&nbsp;-&nbsp;MISSED&nbsp;APPROACH&nbsp;PROCEDURES<br />
    AFTER&nbsp;4.17.3&nbsp;ADD&nbsp;NEW&nbsp;PARAGRAPH&nbsp;AS&nbsp;FOLLOWS:<br />
    DURING&nbsp;THE&nbsp;FINAL&nbsp;APPROACH&nbsp;A&nbsp;PUBLISHED&nbsp;MISSED&nbsp;APPROACH&nbsp;MAY&nbsp;BE<br />
    REQUESTED&nbsp;FROM&nbsp;ATC&nbsp;OR,&nbsp;IN&nbsp;AN&nbsp;EMERGENCY,&nbsp;INITIATED&nbsp;AT&nbsp;ANY&nbsp;TIME<br /><br /></span

  ><span class="notamSeries">A3677/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;28 NOV 2019
    23:05&nbsp;&nbsp;TO:&nbsp;&nbsp;29 JAN 2020 11:59&nbsp; <br /></span
  ><span class="notamText"
    >REF&nbsp;AIP&nbsp;ENR&nbsp;1.10-2&nbsp;1.3.7&nbsp;LOCAL&nbsp;FLIGHT&nbsp;PLANS&nbsp;IN&nbsp;CONTROL&nbsp;ZONES.<br />
    LOCAL&nbsp;VFR&nbsp;FLIGHT&nbsp;NOTIFICATION&nbsp;VIA&nbsp;IFIS&nbsp;IS&nbsp;LIMITED&nbsp;TO&nbsp;NZAA,&nbsp;NZHN&nbsp;<br />
    (APPROVED&nbsp;OPR&nbsp;ONLY),&nbsp;NZWN&nbsp;AND&nbsp;NZCH<br /><br /></span

  ><span class="notamSeries">B7036/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;04 DEC 2019
    11:00&nbsp;&nbsp;TO:&nbsp;&nbsp;18 DEC 2019 11:00&nbsp; <br /></span
  ><span class="notamText"
    >TRIGGER&nbsp;NOTAM&nbsp;-&nbsp;AIRAC&nbsp;SUP&nbsp;EFFECTIVE&nbsp;5&nbsp;DEC&nbsp;19.<br />
    REFER&nbsp;'CONTENTS'&nbsp;OF&nbsp;SUP&nbsp;(BOOKLET)&nbsp;EFFECTIVE&nbsp;5&nbsp;DEC&nbsp;19&nbsp;FOR&nbsp;LIST&nbsp;OF&nbsp;<br />
    SIGNIFICANT&nbsp;CHANGES.<br />
    NIL&nbsp;AIP&nbsp;AMDT&nbsp;THIS&nbsp;CYCLE.<br />
    NEXT&nbsp;AIP&nbsp;SUP&nbsp;EFFECTIVE&nbsp;&nbsp;2&nbsp;JAN&nbsp;20.<br />
    NEXT&nbsp;AIP&nbsp;AMDT&nbsp;EFFECTIVE&nbsp;30&nbsp;JAN&nbsp;20.<br /><br /></span

  ><span class="notamSeries">A1397/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;16 MAY 2019
    22:30&nbsp;&nbsp;TO:&nbsp;&nbsp;PERM<br /></span
  ><span class="notamText"
    >REF&nbsp;VNC&nbsp;1:250000&nbsp;C1&nbsp;WHANGAREI&nbsp;EFFECTIVE&nbsp;8&nbsp;NOV&nbsp;18.<br />
    ADD&nbsp;UNVERIFIED&nbsp;MAST&nbsp;AT&nbsp;36&nbsp;09&nbsp;55.12&nbsp;S&nbsp;173&nbsp;56&nbsp;26.38&nbsp;E&nbsp;APRX&nbsp;680FT&nbsp;AMSL<br /><br /></span
  ><span class="notamSeries">A3703/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;01 DEC 2019
    22:37&nbsp;&nbsp;TO:&nbsp;&nbsp;21 FEB 2020 00:00&nbsp; <br /></span
  ><span class="notamText"
    >REF&nbsp;VNC&nbsp;B2,&nbsp;B3,&nbsp;C2&nbsp;AND&nbsp;C7.&nbsp;ADD&nbsp;TEMP&nbsp;679FT&nbsp;AMSL&nbsp;LIT&nbsp;MAST&nbsp;AT<br />
    41&nbsp;05&nbsp;40.20&nbsp;S&nbsp;174&nbsp;50&nbsp;59.52&nbsp;E<br /><br /></span
  ><span class="notamSeries">B7161/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;06 DEC 2019
    18:02&nbsp;&nbsp;TO:&nbsp;&nbsp;07 DEC 2019 03:00&nbsp; EST<br /></span
  ><span class="notamText"
    >ACC/FIS&nbsp;129.3&nbsp;MHZ&nbsp;A/G&nbsp;FAC&nbsp;REDUCED&nbsp;COVERAGE&nbsp;LOW&nbsp;LEVEL&nbsp;MCKENZIE<br />
    BASIN&nbsp;AND&nbsp;TIMARU&nbsp;AREA<br /><br /></span
  ><span class="notamSeries">A2556/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;28 SEP 2019
    18:00&nbsp;&nbsp;TO:&nbsp;&nbsp;30 DEC 2019 04:00&nbsp; <br /></span
  ><span class="notamText"
    >DAILY 1800-0400<br />AERIAL&nbsp;CABLE&nbsp;OBST.&nbsp;LOGGING&nbsp;OPR&nbsp;WILL&nbsp;TAKE&nbsp;PLACE&nbsp;WITHIN<br />
    0.5NM&nbsp;RADIUS&nbsp;44&nbsp;02&nbsp;32&nbsp;S&nbsp;171&nbsp;05&nbsp;07&nbsp;E&nbsp;APRX&nbsp;14NM&nbsp;W&nbsp;OF&nbsp;NZRI.&nbsp;<br />
    MAX&nbsp;HGT&nbsp;330FT&nbsp;AGL<br /><br /></span

  ><span class="notamSeries">A2611/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;08 SEP 2019
    22:56&nbsp;&nbsp;TO:&nbsp;&nbsp;PERM<br /></span
  ><span class="notamText"
    >REF&nbsp;VNC&nbsp;C10,&nbsp;AMEND&nbsp;NZCW&nbsp;(44&nbsp;58&nbsp;48&nbsp;S&nbsp;169&nbsp;13&nbsp;06&nbsp;E)&nbsp;RWY&nbsp;LENGTH&nbsp;FROM<br />
    1550M&nbsp;TO&nbsp;800M.&nbsp;AMEND&nbsp;NZCW&nbsp;ELEV&nbsp;ON&nbsp;VNC&nbsp;C10,&nbsp;B4&nbsp;AND&nbsp;B6&nbsp;TO&nbsp;READ&nbsp;1036<br /><br /></span
  ><span class="navWarnings">NAVIGATIONAL WARNINGS</span><br /><br /><span
    class="notamSeries"
    >A3707/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;05 DEC 2019
    19:00&nbsp;&nbsp;TO:&nbsp;&nbsp;08 DEC 2019 07:00&nbsp; <br /></span
  ><span class="notamText"
    >DAILY 1900-0700<br />EXTENSIVE&nbsp;REMOTELY&nbsp;PILOTED&nbsp;ACFT&nbsp;ACT&nbsp;WILL&nbsp;TAKE&nbsp;PLACE&nbsp;WITHIN&nbsp;0.5NM&nbsp;<br />
    RADIUS&nbsp;OF&nbsp;37&nbsp;19&nbsp;20&nbsp;S&nbsp;175&nbsp;02&nbsp;21&nbsp;E,&nbsp;APRX&nbsp;5.3NM&nbsp;SSW&nbsp;OF&nbsp;NZME<br />
    LOWER:&nbsp;SFC&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UPPER:&nbsp;1700FT
    AMSL<br /><br /></span
  ><span class="notamSeries">B6729/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;17 NOV 2019
    23:57&nbsp;&nbsp;TO:&nbsp;&nbsp;17 DEC 2019 00:00&nbsp; EST<br /></span
  ><span class="notamText"
    >VOLCANIC&nbsp;HAZARD&nbsp;ZONE&nbsp;NZV215&nbsp;WHITE&nbsp;ISLAND&nbsp;IS&nbsp;REDEFINED&nbsp;AS&nbsp;FLW&nbsp;DUE&nbsp;<br />
    TO&nbsp;INCREASED&nbsp;VOLCANIC&nbsp;ACT:<br />
    ALL&nbsp;THAT&nbsp;AIRSPACE&nbsp;BOUNDED&nbsp;BY&nbsp;A&nbsp;CIRCLE&nbsp;RADIUS&nbsp;8NM<br />
    CENTRED&nbsp;ON&nbsp;37&nbsp;31&nbsp;10.9&nbsp;S&nbsp;177&nbsp;10&nbsp;44.5&nbsp;E&nbsp;WHITE&nbsp;ISLAND.<br />
    PILOTS&nbsp;ARE&nbsp;REQ&nbsp;TO&nbsp;REP&nbsp;LOCATION&nbsp;OF&nbsp;VA&nbsp;AND&nbsp;ANY&nbsp;VOLCANIC&nbsp;ACT&nbsp;OBS.<br />
    PRESCRIBED&nbsp;PURSUANT&nbsp;TO&nbsp;CIVIL&nbsp;AVIATION&nbsp;RULE&nbsp;PART&nbsp;71&nbsp;UNDER&nbsp;A&nbsp;DELEGATED&nbsp;<br />
    AUTHORITY&nbsp;ISSUED&nbsp;BY&nbsp;THE&nbsp;DIRECTOR&nbsp;OF&nbsp;CIVIL&nbsp;AVIATION<br />
    LOWER:&nbsp;SFC&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UPPER:&nbsp;FL150<br /><br /></span

  ><span class="notamSeries">B6982/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;07 DEC 2019
    18:50&nbsp;&nbsp;TO:&nbsp;&nbsp;07 DEC 2019 23:00&nbsp; <br /></span
  ><span class="notamText"
    >NAPIER&nbsp;CTR/D&nbsp;AND&nbsp;NAPIER&nbsp;CTA/D&nbsp;INOP.&nbsp;AD&nbsp;CTL&nbsp;SER&nbsp;AND&nbsp;APP&nbsp;NOT&nbsp;AVBL.&nbsp;<br />
    DELAYS&nbsp;MAY&nbsp;BE&nbsp;EXPERIENCED&nbsp;AT&nbsp;NZNR.<br />
    <br />
    TEMPO&nbsp;RESTRICTED&nbsp;AREA&nbsp;NZR498&nbsp;AND&nbsp;NZR499&nbsp;ARE&nbsp;PRESCRIBED&nbsp;PURSUANT&nbsp;TO&nbsp;<br />
    CIVIL&nbsp;AVIATION&nbsp;RULE&nbsp;PART&nbsp;71&nbsp;UNDER&nbsp;A&nbsp;DELEGATED&nbsp;AUTHORITY&nbsp;ISSUED&nbsp;BY&nbsp;<br />
    THE&nbsp;DIRECTOR&nbsp;OF&nbsp;CIVIL&nbsp;AVIATION&nbsp;TO&nbsp;FACILITATE&nbsp;THE&nbsp;SAFETY&nbsp;OF&nbsp;AIR&nbsp;<br />
    NAVIGATION&nbsp;AT&nbsp;AND&nbsp;IN&nbsp;THE&nbsp;VCY&nbsp;OF&nbsp;NZNR&nbsp;AD.<br />
    ADMINISTERING&nbsp;AUTHORITY:&nbsp;AIRWAYS.<br />
    THE&nbsp;LATERAL&nbsp;AND&nbsp;VERTICAL&nbsp;DIMENSIONS&nbsp;OF&nbsp;NZR498&nbsp;ARE&nbsp;THE&nbsp;SAME&nbsp;AS&nbsp;THOSE&nbsp;<br />
    OF&nbsp;THE&nbsp;NAPIER&nbsp;CTR/D.&nbsp;THE&nbsp;LATERAL&nbsp;AND&nbsp;VERTICAL&nbsp;DIMENSIONS&nbsp;OF&nbsp;NZR499&nbsp;<br />
    ARE&nbsp;THE&nbsp;SAME&nbsp;AS&nbsp;THOSE&nbsp;OF&nbsp;THE&nbsp;NAPIER&nbsp;CTA/D.<br />
    THE&nbsp;FLW&nbsp;FLT&nbsp;AND&nbsp;COM&nbsp;PROCEDURES&nbsp;APPLY&nbsp;WHEN&nbsp;OPR&nbsp;WI&nbsp;NZR498&nbsp;AND&nbsp;NZR499:<br />
    OPERATION&nbsp;OF&nbsp;TRANSPONDERS&nbsp;IN&nbsp;MODE&nbsp;C&nbsp;OR&nbsp;S&nbsp;MANDATORY.<br />
    OPERATION&nbsp;OF&nbsp;RADIOS&nbsp;MANDATORY.<br />
    <br />
    VFR&nbsp;FLIGHTS:<br />
    VFR&nbsp;OPS&nbsp;PERMITTED&nbsp;PROVIDED:<br />
    ACFT&nbsp;OPR&nbsp;NO&nbsp;CLOSER&nbsp;THAN&nbsp;1000FT&nbsp;VERTICALLY&nbsp;AND&nbsp;1NM&nbsp;HORIZONTALLY&nbsp;FM&nbsp;<br />
    CLD,&nbsp;PSN&nbsp;AND&nbsp;INTENTIONS&nbsp;REP&nbsp;ON&nbsp;118.1&nbsp;MHZ&nbsp;ARE&nbsp;MADE&nbsp;AT&nbsp;ENTRY,&nbsp;EXIT&nbsp;<br />
    AND&nbsp;AT&nbsp;INTERVALS&nbsp;OF&nbsp;NOT&nbsp;MORE&nbsp;THAN&nbsp;5&nbsp;MIN,&nbsp;TO&nbsp;ENSURE&nbsp;MUTUAL&nbsp;TRAFFIC&nbsp;<br />
    INFORMATION&nbsp;BTN&nbsp;ALL&nbsp;ACFT&nbsp;OPERATING&nbsp;IN&nbsp;THE&nbsp;AIRSPACE.&nbsp;ACFT&nbsp;SHALL&nbsp;OPR&nbsp;<br />
    LANDING&nbsp;LIGHTS&nbsp;AND/OR&nbsp;ANTI-COLLISION&nbsp;LIGHTS&nbsp;IF&nbsp;EQUIPPED.<br />
    <br />
    ARRIVING&nbsp;VFR&nbsp;TFC:<br />
    WHEN&nbsp;IFR&nbsp;TFC&nbsp;OPR&nbsp;WITHIN&nbsp;NZR498&nbsp;AND&nbsp;NZR499&nbsp;VFR&nbsp;ARRIVALS&nbsp;ARE&nbsp;TO&nbsp;AVOID&nbsp;<br />
    THE&nbsp;INSTRUMENT&nbsp;SECTOR&nbsp;UNTIL&nbsp;ABLE&nbsp;TO&nbsp;ESTABLISH&nbsp;ON&nbsp;DOWNWIND&nbsp;OR&nbsp;BASE&nbsp;<br />
    LEG.<br />
    <br />
    DEPARTING&nbsp;VFR&nbsp;TFC:<br />
    WHEN&nbsp;IFR&nbsp;TFC&nbsp;OPR&nbsp;WITHIN&nbsp;NZR498&nbsp;AND&nbsp;NZR499&nbsp;VFR&nbsp;DEPARTURES&nbsp;ARE&nbsp;TO&nbsp;<br />
    CONTINUE&nbsp;CROSSWIND&nbsp;UNTIL&nbsp;CLEAR&nbsp;OF&nbsp;THE&nbsp;INSTRUMENT&nbsp;SECTOR&nbsp;AND&nbsp;THEN&nbsp;<br />
    REMAIN&nbsp;CLEAR.<br />
    <br />
    VFR&nbsp;TRAINING:<br />
    WHEN&nbsp;IFR&nbsp;TFC&nbsp;OPR&nbsp;WITHIN&nbsp;NZR498&nbsp;VFR&nbsp;TRAINING&nbsp;IS&nbsp;TO&nbsp;REMAIN&nbsp;CLEAR&nbsp;OF&nbsp;<br />
    THE&nbsp;INSTRUMENT&nbsp;SECTOR.<br />
    <br />
    IFR&nbsp;FLIGHTS:<br />
    ONLY&nbsp;ONE&nbsp;IFR&nbsp;ARRIVAL/DEPARTURE&nbsp;AT&nbsp;A&nbsp;TIME&nbsp;IS&nbsp;PERMITTED&nbsp;WI&nbsp;NZR499&nbsp;EXC&nbsp;<br />
    THAT&nbsp;MORE&nbsp;THAN&nbsp;ONE&nbsp;ACFT&nbsp;MAY&nbsp;BE&nbsp;PERMITTED&nbsp;WI&nbsp;NZR499&nbsp;BY&nbsp;ATC&nbsp;APPROVAL.<br />
    <br />
    ONLY&nbsp;ONE&nbsp;IFR&nbsp;ARRIVAL/DEPARTURE&nbsp;IS&nbsp;PERMITTED&nbsp;WI&nbsp;NZR498&nbsp;AT&nbsp;A&nbsp;TIME&nbsp;EXC&nbsp;<br />
    THAT&nbsp;MORE&nbsp;THAN&nbsp;ONE&nbsp;ACFT&nbsp;MAY&nbsp;BE&nbsp;PERMITTED&nbsp;WI&nbsp;NZR498&nbsp;WHEN&nbsp;THE&nbsp;REPORTED&nbsp;<br />
    WX&nbsp;COND&nbsp;ARE&nbsp;SUITABLE&nbsp;AND&nbsp;THE&nbsp;PILOTS&nbsp;REPORT&nbsp;THAT&nbsp;THEY&nbsp;ARE&nbsp;ABLE&nbsp;TO&nbsp;<br />
    MAINTAIN&nbsp;VISUAL&nbsp;SEPARATION.<br />
    <br />
    IFR&nbsp;TRAINING&nbsp;IS&nbsp;NOT&nbsp;PERMITTED.<br />
    <br />
    ARRIVING&nbsp;TFC:<br />
    BCST&nbsp;PSN&nbsp;RELATIVE&nbsp;TO&nbsp;A&nbsp;PUBLISHED&nbsp;REP,&nbsp;ALT&nbsp;AND&nbsp;INTENTIONS&nbsp;ON&nbsp;118.1<br />
    MHZ.<br />
    CONFORM&nbsp;WITH&nbsp;OR&nbsp;AVOID&nbsp;THE&nbsp;AD&nbsp;TFC&nbsp;CIRCUIT&nbsp;FORMED&nbsp;BY&nbsp;OTHER&nbsp;ACFT.<br />
    <br />
    IFR&nbsp;FLIGHTS:<br />
    REP&nbsp;AT&nbsp;EARLIEST&nbsp;OPPORTUNITY&nbsp;WHEN&nbsp;ABLE&nbsp;TO&nbsp;CONTINUE&nbsp;VISUALLY&nbsp;IN&nbsp;ORDER&nbsp;<br />
    TO&nbsp;SAFELY&nbsp;INTEGRATE&nbsp;INTO&nbsp;THE&nbsp;AD&nbsp;CIRCUIT.<br />
    <br />
    OVERFLYING&nbsp;TFC:<br />
    BCST&nbsp;PSN&nbsp;RELATIVE&nbsp;TO&nbsp;A&nbsp;PUBLISHED&nbsp;REP,&nbsp;ALT&nbsp;AND&nbsp;INTENTIONS&nbsp;ON&nbsp;118.1&nbsp;<br />
    MHZ.<br />
    REMAIN&nbsp;CLR&nbsp;OF&nbsp;THE&nbsp;CIRCUIT&nbsp;AREA.<br />
    <br />
    DEPARTING&nbsp;TFC:<br />
    BCST&nbsp;INTENTIONS&nbsp;ON&nbsp;118.1&nbsp;MHZ&nbsp;IMMEDIATELY&nbsp;PRIOR&nbsp;TO&nbsp;TAXI&nbsp;AND&nbsp;THEN&nbsp;<br />
    AGAIN&nbsp;IMMEDIATELY&nbsp;PRIOR&nbsp;TO&nbsp;ENTERING&nbsp;THE&nbsp;RWY&nbsp;FOR&nbsp;TKOF.<br />
    <br />
    IFR&nbsp;FLIGHTS:<br />
    CTC&nbsp;OHAKEA&nbsp;CTL&nbsp;ON&nbsp;124.8&nbsp;MHZ&nbsp;(IF&nbsp;UNABLE&nbsp;TEL&nbsp;0800&nbsp;626&nbsp;756&nbsp;LANDLINE&nbsp;OR&nbsp;<br />
    +64&nbsp;3&nbsp;358&nbsp;1509)&nbsp;FOR&nbsp;ROUTE&nbsp;CLR&nbsp;PRIOR&nbsp;TO&nbsp;START.&nbsp;IFR&nbsp;FLIGHTS&nbsp;ARE&nbsp;NOT&nbsp;<br />
    PERMITTED&nbsp;TO&nbsp;DEP&nbsp;UNTIL&nbsp;THEY&nbsp;ARE&nbsp;IN&nbsp;RECEIPT&nbsp;OF&nbsp;A&nbsp;ROUTE&nbsp;CLR<br />
    LOWER:&nbsp;SFC&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UPPER:&nbsp;9500FT
    AMSL<br /><br /></span

  ><span class="notamSeries">A2767/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;04 OCT 2019
    19:00&nbsp;&nbsp;TO:&nbsp;&nbsp;29 DEC 2019 07:00&nbsp; <br /></span
  ><span class="notamText"
    >EXTENSIVE&nbsp;REMOTELY&nbsp;PILOTED&nbsp;ACFT&nbsp;ACTIVITY&nbsp;WILL&nbsp;TAKE&nbsp;PLACE&nbsp;WI&nbsp;0.5NM&nbsp;<br />
    41&nbsp;08&nbsp;23.74&nbsp;S&nbsp;175&nbsp;02&nbsp;34.43E&nbsp;(TRENTHAM&nbsp;RACECOURSE)&nbsp;APRX&nbsp;15.5NM&nbsp;NE&nbsp;NZWN<br />
    SAT&nbsp;SUN&nbsp;0800-2000&nbsp;NEW&nbsp;ZEALAND&nbsp;DAYLIGHT&nbsp;TIME<br />
    LOWER:&nbsp;SFC&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UPPER:&nbsp;1500FT
    AMSL<br /><br /></span

  ><span class="notamSeries">A2774/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;29 SEP 2019
    01:00&nbsp;&nbsp;TO:&nbsp;&nbsp;27 DEC 2019 07:00&nbsp; <br /></span
  ><span class="notamText"
    >EXTENSIVE&nbsp;REMOTELY&nbsp;PILOTED&nbsp;ACFT&nbsp;ACTIVITY&nbsp;WILL&nbsp;TAKE&nbsp;PLACE&nbsp;WI&nbsp;0.5NM&nbsp;<br />
    41&nbsp;08&nbsp;23.74&nbsp;S&nbsp;175&nbsp;02&nbsp;34.43E&nbsp;(TRENTHAM&nbsp;RACECOURSE)&nbsp;APRX&nbsp;15.5NM&nbsp;NE&nbsp;NZWN<br />
    MON-FRI&nbsp;1400-2000&nbsp;NEW&nbsp;ZEALAND&nbsp;DAYLIGHT&nbsp;TIME<br />
    LOWER:&nbsp;SFC&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UPPER:&nbsp;1500FT
    AMSL<br /><br /></span

  ><span class="notamSeries">A3747/19</span
  ><span class="notamToFrom">
    &nbsp;&nbsp;&nbsp; FROM:&nbsp;&nbsp;05 DEC 2019
    20:00&nbsp;&nbsp;TO:&nbsp;&nbsp;08 DEC 2019 05:00&nbsp; <br /></span
  ><span class="notamText"
    >DAILY 2000-0500<br />INTENSIVE&nbsp;REMOTELY&nbsp;PILOTED&nbsp;ACFT&nbsp;ACT&nbsp;WILL&nbsp;TAKE&nbsp;PLACE&nbsp;WI&nbsp;1NM&nbsp;RADIUS<br />
    43&nbsp;40&nbsp;54&nbsp;S&nbsp;172&nbsp;32&nbsp;37&nbsp;E&nbsp;(1.2NM&nbsp;S&nbsp;TAI&nbsp;TAPU),&nbsp;APRX&nbsp;11.8NM&nbsp;SSE&nbsp;NZCH<br />
    LOWER:&nbsp;SFC&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UPPER:&nbsp;1500FT AGL<br /><br /></span
  ><span class="metSectionHeader">MET</span><br /><br /><span
    class="metLocation"
    >NZKK&nbsp;(KERIKERI) </span
  ><br /><br /><span class="metText"
    >METAR NZKK 062230Z AUTO 33011G24KT 290V360 20KM FEW023/// SCT028///<br />
    24/18 Q1019=</span
  ><br /><br /><span class="metText"
    >TAF NZKK 062215Z 0623/0711<br />
    32008KT 15KM -SHRA SCT025<br />
    BECMG 0623/0701 02010KT<br />
    TEMPO 0700/0706 6000 SHRA FEW020TCU<br />
    PROB30 TEMPO 0700/0705 3000 TSRAGS FEW020CB<br />
    BECMG 0709/0711 BKN012<br />
    PROB40 TEMPO 0709/0711 BKN008<br />
    2000FT WIND 34020KT =</span
  ><br /><br /><br /><span class="metLocation">NZWR&nbsp;(WHANGAREI) </span
  ><br /><br /><span class="metText"
    >METAR NZWR 062230Z AUTO 32008KT 260V030 20KM BKN035/// 25/17 Q1018=</span
  ><br /><br /><span class="metText"
    >TAF NZWR 062215Z 0623/0711<br />
    35010KT 15KM -SHRA SCT025<br />
    TEMPO 0700/0708 6000 SHRA<br />
    PROB30 TEMPO 0701/0706 3000 TSRAGS FEW025CB<br />
    TEMPO 0710/0711 BKN012<br />
    2000FT WIND 34015KT =</span
  ><br /><br /><br /><span class="metLocation">NZWP&nbsp;(WHENUAPAI) </span
  ><br /><br /><span class="metText"
    >TAF NZWP 062216Z 0623/0723<br />
    27012KT 15KM -SHRA SCT025<br />
    BECMG 0623/0701 34012KT<br />
    TEMPO 0700/0708 6000 SHRA SCT025TCU<br />
    PROB30 TEMPO 0700/0706 3000 TSRAGS FEW025CB<br />
    FM070900 VRB02KT 15KM BKN025<br />
    TEMPO 0712/0720 BKN012<br />
    PROB30 0712/0719 5000 BR BKN008<br />
    FM072200 03015KT 15KM -SHRA SCT025<br />
    2000FT WIND 34015KT<br />
    BECMG 0712/0714 36025KT =</span
  ><br /><br /><br /><span class="metLocation">NZAA&nbsp;(AUCKLAND) </span
  ><br /><br /><span class="metText"
    >ATIS NZAA P 2202<br />
    APCH: ILS DME<br />
    RWY: 23 LEFT<br />
    RWY COND: DRY<br />
    WIND: 270/14KT 240V300<br />
    VIS: 20 KM<br />
    WX: HZ<br />
    CLD: SCT 2700 FT SCT 3900 FT<br />
    TEMPERATURE: 24 DEW POINT: 17<br />
    QNH: 1018 HPA<br />
    2000 FT WIND: REP 280/12KT<br />
    ON FIRST CTC WITH NZAA ATC NOTIFY RCPT OF P.</span
  ><br /><br /><span class="metText"
    >METAR NZAA 062230Z AUTO 29014KT 260V320 9999 SCT029/// SCT039///<br />
    24/17 Q1018 NOSIG=</span
  ><br /><br /><span class="metText"
    >TAF NZAA 061702Z 0618/0718<br />
    02005KT 9999 FEW030<br />
    FM062200 31015KT 9999 -SHRA SCT035<br />
    TEMPO 0701/0708 6000 SHRA FEW025TCU<br />
    PROB30 TEMPO 0702/0706 3000 TSRAGS FEW025CB<br />
    BECMG 0707/0709 01008KT<br />
    2000FT WIND 34020KT<br />
    BECMG 0712/0714 35030KT =</span
  ><br /><br /><br /><span class="metLocation">NZTG&nbsp;(TAURANGA) </span
  ><br /><br /><span class="metText"
    >ATIS NZTG I 2216<br />
    APCH: RNAV<br />
    RWY: 07<br />
    RWY COND: DRY<br />
    WIND: 360/8KT 330V030<br />
    VIS: 12 KM<br />
    CLD: FEW 2500 FT<br />
    TEMPERATURE: 22 DEW POINT: 17<br />
    QNH: 1018 HPA<br />
    2000 FT WIND: FORECAST 300/15KT<br />
    ON FIRST CTC WITH NZTG TWR NOTIFY RCPT OF I.</span
  ><br /><br /><span class="metText"
    >METAR NZTG 062230Z AUTO 01009KT 340V050 21KM NCD 23/18 Q1018=</span
  ><br /><br /><span class="metText"
    >TAF NZTG 062213Z 0623/0720<br />
    01012KT 15KM -SHRA SCT025<br />
    PROB30 TEMPO 0702/0706 3000 TSRAGS FEW020CB<br />
    PROB40 TEMPO 0706/0708 6000 SHRA FEW020TCU<br />
    BECMG 0710/0712 BKN012<br />
    PROB40 TEMPO 0712/0719 5000 BR BKN006<br />
    2000FT WIND 34015KT<br />
    BECMG 0712/0714 36025KT =</span
  ><br /><br /><br /><span class="metLocation">NZHN&nbsp;(HAMILTON) </span
  ><br /><br /><span class="metText"
    >ATIS NZHN F 2237<br />
    APCH: RNAV Z<br />
    RWY: 36 RIGHT<br />
    RWY COND: DRY<br />
    OPR INFO: CTN, INCREASED BIRD ACT.<br />
    WIND: 270/13KT 240V300<br />
    VIS: 15 KM<br />
    WX: HZ<br />
    CLD: SCT 2700 FT SCT 3900 FT<br />
    TEMPERATURE: 25 DEW POINT: 18<br />
    QNH: 1017 HPA<br />
    2000 FT WIND: FORECAST 320/20KT<br />
    ON FIRST CTC WITH NZHN ATC NOTIFY RCPT OF F.</span
  ><br /><br /><span class="metText"
    >METAR NZHN 062230Z AUTO 31010KT 270V340 20KM FEW026/// SCT032///<br />
    24/17 Q1018=</span
  ><br /><br /><span class="metText"
    >TAF NZHN 061702Z 0618/0718<br />
    03005KT 15KM SCT015 BKN025<br />
    TEMPO 0618/0620 BKN014<br />
    FM062100 31012KT 15KM -SHRA BKN025<br />
    TEMPO 0702/0708 7000 SHRA FEW020TCU<br />
    PROB30 TEMPO 0703/0707 3000 TSRAGS FEW025CB<br />
    FM070800 01005KT 15KM FEW015 BKN020<br />
    PROB30 TEMPO 0712/0718 BKN014<br />
    2000FT WIND 34020KT<br />
    BECMG 0713/0715 35030KT =</span
  ><br /><br /><br /><span class="metLocation">NZWK&nbsp;(WHAKATANE) </span
  ><br /><br /><span class="metText"
    >METAR NZWK 062230Z AUTO 34011KT 18KM SCT055/// 22/19 Q1019=</span
  ><br /><br /><span class="metText"
    >TAF NZWK 062215Z 0623/0711<br />
    36012KT 15KM -SHRA SCT025<br />
    PROB40 TEMPO 0703/0705 6000 SHRA FEW025TCU<br />
    BECMG 0706/0708 BKN012<br />
    PROB40 TEMPO 0708/0711 5000 BR BKN006<br />
    2000FT WIND 34020KT =</span
  ><br /><br /><br /><span class="metLocation">NZRO&nbsp;(ROTORUA) </span
  ><br /><br /><span class="metText"
    >ATIS NZRO K 2232<br />
    APCH: RNAV B<br />
    RWY: 36<br />
    RWY COND: DRY<br />
    WIND: 310/8KT<br />
    VIS: 24 KM<br />
    CLD: FEW 4000 FT SCT 4500 FT BKN 6500 FT<br />
    TEMPERATURE: 22 DEW POINT: 17<br />
    QNH: 1018 HPA<br />
    2000 FT WIND: FORECAST 300/15KT<br />
    ON FIRST CTC WITH NZRO TWR NOTIFY RCPT OF K.</span
  ><br /><br /><span class="metText"
    >METAR NZRO 062230Z AUTO 34008KT 310V030 26KM FEW025/// SCT033///<br />
    BKN085/// 22/17 Q1018=</span
  ><br /><br /><span class="metText"
    >TAF NZRO 062215Z 0623/0711<br />
    36012KT 15KM -SHRA SCT030<br />
    TEMPO 0700/0708 6000 SHRA<br />
    PROB40 TEMPO 0700/0706 4000 TSRA FEW025CB<br />
    FM070800 VRB02KT 15KM BKN025<br />
    PROB40 0708/0711 BKN012<br />
    2000FT WIND 35020KT =</span
  ><br /><br /><br /><span class="metLocation">NZGS&nbsp;(GISBORNE) </span
  ><br /><br /><span class="metText"
    >ATIS NZGS F 2234<br />
    APCH: VOR DME<br />
    RWY: 32<br />
    RWY COND: DRY<br />
    WIND: 310/21KT MNM 10<br />
    VIS: 20 KM<br />
    WX: HZ<br />
    CLD: FEW 5000 FT<br />
    TEMPERATURE: 26 DEW POINT: 15<br />
    QNH: 1016 HPA<br />
    SIGWX: COND SUITABLE FOR A VISUAL APCH.<br />
    2000 FT WIND: FORECAST 310/25KT<br />
    ON FIRST CTC WITH NZGS TWR NOTIFY RCPT OF F.</span
  ><br /><br /><span class="metText"
    >METAR NZGS 062230Z AUTO 33016G26KT 290V020 19KM SCT050/// SCT060///<br />
    26/14 Q1016=</span
  ><br /><br /><span class="metText"
    >TAF NZGS 062215Z 0623/0711<br />
    33015G25KT 20KM FEW050<br />
    BECMG 0707/0709 33008KT<br />
    2000FT WIND 33025KT =</span
  ><br /><br /><br /><span class="metLocation">NZAP&nbsp;(TAUPO) </span
  ><br /><br /><span class="metText"
    >METAR NZAP 062230Z AUTO 28007KT 240V310 19KM SCT036/// SCT044///<br />
    BKN060/// 21/14 Q1018=</span
  ><br /><br /><span class="metText"
    >TAF NZAP 061009Z 0611/0705<br />
    VRB02KT 12KM SCT012<br />
    BECMG 0621/0623 34010KT<br />
    2000FT WIND 32015KT =</span
  ><br /><br /><br /><span class="metLocation">NZNP&nbsp;(NEW PLYMOUTH) </span
  ><br /><br /><span class="metText"
    >ATIS NZNP G 2157<br />
    APCH: RNAV<br />
    RWY: 05<br />
    RWY COND: DRY<br />
    WIND: 350/14KT<br />
    VIS: 15 KM, REDUCING 7 KM<br />
    WX: SH IN VCY, HZ<br />
    CLD: SCT 1200 FT BKN 1800 FT BKN 3000 FT<br />
    TEMPERATURE: 20 DEW POINT: 18<br />
    QNH: 1016 HPA<br />
    2000 FT WIND: REP 300/30KT<br />
    ON FIRST CTC WITH NZNP TWR NOTIFY RCPT OF G.</span
  ><br /><br /><span class="metText"
    >METAR NZNP 062230Z AUTO 01016KT 15KM BKN016/// 21/19 Q1016=</span
  ><br /><br /><span class="metText"
    >TAF AMD NZNP 061552Z 0615/0705<br />
    35005KT 15KM -SHRA SCT008 BKN025<br />
    TEMPO 0615/0618 BKN008<br />
    TEMPO 0618/0623 BKN012<br />
    BECMG 0622/0700 35015G25KT<br />
    2000FT WIND 34020KT<br />
    BECMG 0622/0700 34030KT =</span
  ><br /><br /><br /><span class="metLocation">NZNR&nbsp;(NAPIER) </span
  ><br /><br /><span class="metText"
    >ATIS NZNR C 2051<br />
    APCH: RNAV<br />
    RWY: 34<br />
    RWY COND: DRY<br />
    WIND: 300/17KT 280V340<br />
    VIS: 30 KM<br />
    CLD: FEW 4000 FT<br />
    TEMPERATURE: 25 DEW POINT: 10<br />
    QNH: 1014 HPA<br />
    SIGWX: HZ COND SUITABLE FOR A VISUAL APCH.<br />
    2000 FT WIND: FORECAST 280/25KT<br />
    ON FIRST CTC WITH NZNR TWR NOTIFY RCPT OF C.</span
  ><br /><br /><span class="metText"
    >METAR NZNR 062230Z AUTO 31022G34KT 19KM NCD 26/09 Q1014=</span
  ><br /><br /><span class="metText"
    >TAF NZNR 062215Z 0623/0711<br />
    32020G30KT 20KM FEW060<br />
    BECMG 0704/0706 04012KT<br />
    BECMG 0707/0709 34005KT<br />
    2000FT WIND 33025KT =</span
  ><br /><br /><br /><span class="metLocation">NZWU&nbsp;(WHANGANUI) </span
  ><br /><br /><span class="metText"
    >METAR NZWU 062230Z AUTO 33014G24KT 290V010 //// SCT047/// 23/14 Q1013<br />
    =</span
  ><br /><br /><span class="metText"
    >TAF NZWU 061009Z 0611/0705<br />
    34005KT 10KM FEW012<br />
    BECMG 0621/0623 33016G28KT<br />
    2000FT WIND 32030KT =</span
  ><br /><br /><br /><span class="metLocation">NZOH&nbsp;(OHAKEA) </span
  ><br /><br /><span class="metText"
    >ATIS NZOH G 2215<br />
    APCH: ILS DME<br />
    RWY: 27<br />
    RWY COND: DRY<br />
    OPR INFO: GND NOT OPG<br />
    WIND: 290/17KT<br />
    VIS: 20 KM<br />
    CLD: SCT 4500 FT<br />
    TEMPERATURE: 24 DEW POINT: 13<br />
    QNH: 1013 HPA<br />
    SIGWX: COND SUITABLE FOR A VISUAL APCH.<br />
    2000 FT WIND: FORECAST 290/25KT<br />
    ON FIRST CTC WITH NZOH ATC NOTIFY RCPT OF G.</span
  ><br /><br /><span class="metText"
    >METAR NZOH 062200Z 32016G26KT 290V350 20KM FEW045 BKN270 23/12 Q1014=</span
  ><br /><br /><span class="metText"
    >TAF NZOH 061702Z 0618/0718<br />
    VRB02KT 15KM FEW040<br />
    BECMG 0619/0621 32012KT<br />
    BECMG 0622/0700 30018G30KT<br />
    FM070600 33008KT 15KM -RA SCT015 BKN030 =</span
  ><br /><br /><br /><span class="metLocation"
    >NZPM&nbsp;(PALMERSTON NORTH) </span
  ><br /><br /><span class="metText"
    >ATIS NZPM G 2205<br />
    APCH: RNAV<br />
    RWY: 25<br />
    OPR INFO: GND NOT OPR.<br />
    WIND: 320/20KT<br />
    VIS: 20 KM<br />
    WX: HZ<br />
    CLD: FEW 3500 FT SCT 4500 FT<br />
    TEMPERATURE: 23 DEW POINT: 13<br />
    QNH: 1013 HPA<br />
    SIGWX: COND SUITABLE FOR A VISUAL APCH.<br />
    2000 FT WIND: FORECAST 290/25KT<br />
    ON FIRST CTC WITH NZPM TWR NOTIFY RCPT OF G.</span
  ><br /><br /><span class="metText"
    >METAR NZPM 062230Z AUTO 32012KT 290V360 23KM BKN050/// 23/13 Q1013=</span
  ><br /><br /><span class="metText"
    >TAF NZPM 061009Z 0611/0705<br />
    VRB02KT 12KM FEW015<br />
    BECMG 0621/0623 32018G30KT<br />
    2000FT WIND 31025KT =</span
  ><br /><br /><br /><span class="metLocation">NZPP&nbsp;(PARAPARAUMU) </span
  ><br /><br /><span class="metText"
    >METAR NZPP 062230Z AUTO 01014KT 18KM FEW023/// BKN055/// BKN065///<br />
    20/16 Q1013=</span
  ><br /><br /><span class="metText"
    >TAF AMD NZPP 061548Z 0615/0705<br />
    04008KT 15KM SCT012 BKN025<br />
    TEMPO 0615/0617 BKN014<br />
    BECMG 0620/0622 01015G25KT<br />
    2000FT WIND 33025KT<br />
    BECMG 0622/0700 31040KT =</span
  ><br /><br /><br /><span class="metLocation">NZMS&nbsp;(MASTERTON) </span
  ><br /><br /><span class="metText"
    >METAR NZMS 062230Z AUTO 32019G32KT 290V350 19KM FEW055/// 23/11 Q1011<br />
    =</span
  ><br /><br /><span class="metText"
    >TAF NZMS 062215Z 0623/0711<br />
    32015G25KT 20KM FEW060<br />
    FM070600 35010KT 20KM -SHRA FEW025 SCT050<br />
    2000FT WIND 31030KT =</span
  ><br /><br /><br /><span class="metLocation">NZNS&nbsp;(NELSON) </span
  ><br /><br /><span class="metText"
    >ATIS NZNS M 2227<br />
    APCH: RNAV<br />
    RWY: 02<br />
    WIND: 350/28KT<br />
    VIS: 8 KM, REDUCING 5 KM<br />
    WX: HZ<br />
    CLD: BKN 700 FT BKN 1100 FT<br />
    TEMPERATURE: 19 DEW POINT: 18<br />
    QNH: 1010 HPA<br />
    2000 FT WIND: FORECAST 330/30KT<br />
    ON FIRST CTC WITH NZNS TWR NOTIFY RCPT OF M.</span
  ><br /><br /><span class="metText"
    >METAR NZNS 062230Z AUTO 02027KT 10KM FEW008/// SCT070/// BKN080///<br />
    20/18 Q1010=</span
  ><br /><br /><span class="metText"
    >TAF NZNS 062217Z 0623/0711<br />
    01025G35KT 10KM HZ BKN007<br />
    TEMPO 0702/0705 6000 RA<br />
    PROB40 TEMPO 0702/0705 2000 TSRA BKN006 FEW020CB<br />
    BECMG 0704/0706 01012KT FEW007<br />
    2000FT WIND 35030KT<br />
    BECMG 0623/0701 35045KT<br />
    BECMG 0704/0706 30020KT =</span
  ><br /><br /><br /><span class="metLocation">NZWN&nbsp;(WELLINGTON) </span
  ><br /><br /><span class="metText"
    >ATIS NZWN L 2234<br />
    APCH: ILS DME<br />
    RWY: 34<br />
    RWY COND: DRY<br />
    WIND: 330/23KT 300V360 MAX 42 MNM 13<br />
    VIS: 20 KM<br />
    WX: SH VCY<br />
    CLD: SCT 1300 FT BKN 1700 FT<br />
    TEMPERATURE: 20 DEW POINT: 16<br />
    QNH: 1010 HPA<br />
    SIGWX: MOD TURB REP ON FNA AND DEP. WS REP ON DEP.<br />
    2000 FT WIND: REP 310/45KT<br />
    ON FIRST CTC WITH NZWN ATC NOTIFY RCPT OF L.</span
  ><br /><br /><span class="metText"
    >METAR NZWN 062230Z AUTO 35024G35KT 9999 BKN018/// OVC024/// 20/16<br />
    Q1010 NOSIG RMK KAUKAU 33045KT=</span
  ><br /><br /><span class="metText"
    >TAF NZWN 061702Z 0618/0718<br />
    34020G35KT 9999 -SHRA SCT014 BKN025<br />
    TEMPO 0618/0622 BKN014<br />
    BECMG 0623/0701 35025G45KT<br />
    FM070700 34020G30KT 9999 -RA SCT010 BKN018<br />
    TEMPO 0709/0712 7000 RA BKN014<br />
    TEMPO 0717/0718 5000 RA BKN014 FEW020TCU<br />
    2000FT WIND 34040KT<br />
    BECMG 0620/0622 34050KT<br />
    BECMG 0705/0707 34040KT =</span
  ><br /><br /><br /><span class="metLocation">NZWB&nbsp;(WOODBOURNE) </span
  ><br /><br /><span class="metText"
    >ATIS NZWB C 2035<br />
    APCH: RNAV<br />
    RWY: 24<br />
    WIND: 300/20G31KT 270V330<br />
    VIS: 20 KM<br />
    CLD: SCT 3000 FT BKN 5000 FT<br />
    TEMPERATURE: 22 DEW POINT: 12<br />
    QNH: 1008 HPA<br />
    SIGWX: COND SUITABLE FOR A VISUAL APCH.<br />
    2000 FT WIND: FORECAST 320/50KT<br />
    ON FIRST CTC WITH NZWB TWR NOTIFY RCPT OF C.</span
  ><br /><br /><span class="metText"
    >METAR NZWB 062230Z AUTO 32015KT 20KM BKN050/// OVC065/// 21/13 Q1008=</span
  ><br /><br /><span class="metText"
    >TAF NZWB 062217Z 0623/0711<br />
    32020G35KT 20KM -RA FEW030 BKN050<br />
    TEMPO 0703/0706 6000 RA<br />
    PROB30 TEMPO 0703/0706 3000 TSRA FEW030CB<br />
    BECMG 0705/0707 32012G25KT<br />
    2000FT WIND 33045KT<br />
    BECMG 0706/0708 33030KT =</span
  ><br /><br /><br /><span class="metLocation">NZWS&nbsp;(WESTPORT) </span
  ><br /><br /><span class="metText"
    >METAR NZWS 062230Z AUTO 01026KT 4000 TSRA HZ BKN008/// ///CB 17/16<br />
    Q1007=</span
  ><br /><br /><span class="metText"
    >TAF NZWS 062218Z 0623/0711<br />
    02025KT 20KM -RA BKN008<br />
    TEMPO 0623/0702 2000 TSRAGS SCT020CB<br />
    BECMG 0700/0702 30008KT FEW010 BKN020<br />
    BECMG 0705/0707 02010KT<br />
    2000FT WIND 34035KT<br />
    BECMG 0700/0702 28015KT<br />
    BECMG 0706/0708 34015KT =</span
  ><br /><br /><br /><span class="metLocation">NZHK&nbsp;(HOKITIKA) </span
  ><br /><br /><span class="metText"
    >METAR NZHK 062230Z AUTO 28012KT 240V300 6000 -RA BKN028/// BKN034///<br />
    16/16 Q1006=</span
  ><br /><br /><span class="metText"
    >TAF NZHK 062223Z 0623/0711<br />
    28012KT 15KM -SHRA FEW008 BKN025<br />
    BECMG 0700/0702 36012KT<br />
    TEMPO 0702/0707 7000 SHRA FEW020TCU<br />
    2000FT WIND 30015KT<br />
    BECMG 0705/0707 36020KT =</span
  ><br /><br /><br /><span class="metLocation">NZCH&nbsp;(CHRISTCHURCH) </span
  ><br /><br /><span class="metText"
    >ATIS NZCH P 2240<br />
    APCH: ILS DME<br />
    RWY: 02<br />
    RWY COND: DRY<br />
    WIND: 320/13KT<br />
    VIS: 20 KM<br />
    CLD: NSC<br />
    TEMPERATURE: 20 DEW POINT: 10<br />
    QNH: 1001 HPA<br />
    SIGWX: COND SUITABLE FOR A VISUAL APCH.<br />
    WS AND TURB ON FNA.<br />
    2000 FT WIND: REP 270/40KT<br />
    ON FIRST CTC WITH NZCH ATC NOTIFY RCPT OF P.</span
  ><br /><br /><span class="metText"
    >METAR NZCH 062230Z AUTO 30004KT 210V030 9999 -RA OVC090/// 21/09<br />
    Q1001 TEMPO 30015G25KT 6000 SHRA BECMG FM2300 24010KT RMK SUGARLOAF<br />
    29022KT=</span
  ><br /><br /><span class="metText"
    >TAF AMD NZCH 062139Z 0621/0718<br />
    30015G25KT 9999 SCT050<br />
    TEMPO 0621/0702 6000 SHRA FEW030TCU<br />
    PROB30 TEMPO 0621/0701 3000 TSRA FEW030CB<br />
    BECMG 0623/0701 24010KT<br />
    BECMG 0706/0708 02008KT<br />
    2000FT WIND 36025KT<br />
    BECMG 0623/0701 30025KT<br />
    BECMG 0706/0708 36020KT =</span
  ><br /><br /><br /><span class="metLocation">NZTU&nbsp;(TIMARU) </span
  ><br /><br /><span class="metText"
    >METAR NZTU 062230Z AUTO 33009KT 20KM NCD 19/15 Q0999=</span
  ><br /><br /><span class="metText"
    >TAF NZTU 062217Z 0623/0711<br />
    31008KT 30KM SKC<br />
    BECMG 0700/0702 33015G30KT<br />
    BECMG 0708/0710 03008KT<br />
    2000FT WIND 30030KT<br />
    BECMG 0708/0710 36020KT =</span
  ><br /><br /><br /><span class="metLocation">NZMF&nbsp;(MILFORD SOUND) </span
  ><br /><br /><span class="metText"
    >METAR NZMF 062200Z 31011G26KT 160V090 12KM RA FEW030 SCT040 OVC050CB<br />
    15/09 Q1000=</span
  ><br /><br /><span class="metText"
    >TAF NZMF 062229Z 0623/0711<br />
    33010G20KT 15KM -SHRA FEW030 BKN050<br />
    TEMPO 0623/0705 6000 SHRA FEW030CB<br />
    PROB30 TEMPO 0623/0704 2000 TSRAGS SCT030CB<br />
    TEMPO 0708/0711 6000 SHRA FEW030TCU<br />
    2000FT WIND 33030KT<br />
    BECMG 0705/0707 33020KT =</span
  ><br /><br /><br /><span class="metLocation">NZWF&nbsp;(WANAKA) </span
  ><br /><br /><span class="metText"
    >METAR NZWF 062230Z AUTO 32007KT 290V350 17KM -RA FEW039/// BKN049///<br />
    BKN060/// 15/10 Q0999=</span
  ><br /><br /><span class="metText"
    >TAF NZWF 062221Z 0623/0711<br />
    28008KT 20KM -SHRA FEW030 BKN060<br />
    BECMG 0623/0701 32015G25KT<br />
    PROB30 TEMPO 0701/0705 6000 SHRA FEW030TCU<br />
    BECMG 0706/0708 30008KT<br />
    2000FT WIND 34040KT =</span
  ><br /><br /><br /><span class="metLocation">NZOU&nbsp;(OAMARU) </span
  ><br /><br /><span class="metText"
    >METAR NZOU 062230Z AUTO 01014KT 330V050 20KM NCD 19/12 Q0998=</span
  ><br /><br /><span class="metText"
    >TAF NZOU 062218Z 0623/0711<br />
    01015KT 30KM FEW050<br />
    BECMG 0700/0702 30015G30KT<br />
    BECMG 0706/0708 36008KT<br />
    2000FT WIND 35020KT<br />
    BECMG 0623/0701 33035KT =</span
  ><br /><br /><br /><span class="metLocation">NZQN&nbsp;(QUEENSTOWN) </span
  ><br /><br /><span class="metText"
    >ATIS NZQN P 2231<br />
    APCH: RNAV<br />
    RWY: 23<br />
    RWY COND: WATER PATCHES<br />
    OPR INFO: RWY COND REP ?59<br />
    WIND: VRB /5KT<br />
    VIS: 50 KM, REDUCING 10 KM<br />
    WX: LGT SH OF RA<br />
    CLD: FEW 3500 FT SCT 6500 FT BKN 8000 FT<br />
    TEMPERATURE: 14 DEW POINT: 7<br />
    QNH: 998 HPA<br />
    SIGWX: WS REP ON FNA.<br />
    2000 FT WIND: FORECAST 300/40KT<br />
    ON FIRST CTC WITH NZQN ATC NOTIFY RCPT OF P.</span
  ><br /><br /><span class="metText"
    >METAR NZQN 062230Z AUTO 20001KT 40KM -RA FEW029/// BKN060///<br />
    BKN075/// 14/06 Q0998=</span
  ><br /><br /><span class="metText"
    >TAF AMD NZQN 061824Z 0618/0711<br />
    02005KT 20KM -SHRA SCT060<br />
    TEMPO 0618/0705 6000 SHRA FEW020TCU<br />
    BECMG 0623/0701 27015G25KT<br />
    FM070700 27010KT 30KM SCT060<br />
    BECMG 0709/0711 02005KT<br />
    2000FT WIND 32040KT =</span
  ><br /><br /><br /><span class="metLocation"
    >NZMO&nbsp;(TE ANAU/MANAPOURI) </span
  ><br /><br /><span class="metText"
    >METAR NZMO 062230Z AUTO 05009KT 020V080 19KM FEW015/// SCT020///<br />
    BKN049/// 14/10 Q0997=</span
  ><br /><br /><span class="metText"
    >TAF NZMO 061007Z 0611/0705<br />
    03005KT 20KM -SHRA SCT030 BKN040<br />
    TEMPO 0611/0705 6000 SHRA<br />
    PROB30 TEMPO 0616/0704 2000 TSRAGS FEW030CB<br />
    BECMG 0620/0622 32015G25KT<br />
    2000FT WIND 33040KT =</span
  ><br /><br /><br /><span class="metLocation">NZDN&nbsp;(DUNEDIN) </span
  ><br /><br /><span class="metText"
    >ATIS NZDN N 2208<br />
    APCH: ILS DME<br />
    RWY: 21<br />
    RWY COND: DRY<br />
    OPR INFO: MODEL ACFT AREA ACT.<br />
    WIND: 170/14KT<br />
    VIS: 30 KM<br />
    CLD: FEW 8000 FT SCT 11000 FT<br />
    TEMPERATURE: 17 DEW POINT: 10<br />
    QNH: 997 HPA<br />
    2000 FT WIND: REP 290/24KT<br />
    ON FIRST CTC WITH NZDN TWR NOTIFY RCPT OF N.</span
  ><br /><br /><span class="metText"
    >METAR NZDN 062230Z AUTO 19014KT 160V220 34KM FEW090/// 18/09 Q0997<br />
    RMK SWAMPY 30018KT=</span
  ><br /><br /><span class="metText"
    >TAF NZDN 062216Z 0623/0714<br />
    22012KT 20KM -SHRA FEW030 SCT060<br />
    BECMG 0623/0701 16010KT<br />
    TEMPO 0702/0706 7000 SHRA FEW030TCU<br />
    PROB30 TEMPO 0703/0705 3000 TSRAGS FEW030CB<br />
    BECMG 0705/0707 06008KT<br />
    2000FT WIND 34035KT<br />
    BECMG 0709/0711 34045KT =</span
  ><br /><br /><br /><span class="metLocation">NZNV&nbsp;(INVERCARGILL) </span
  ><br /><br /><span class="metText"
    >ATIS NZNV L 2235<br />
    APCH: RNAV<br />
    RWY: 22<br />
    RWY COND: DRY<br />
    WIND: 300/16KT 270V350<br />
    VIS: 60 KM<br />
    CLD: FEW 4500 FT SCT 6500 FT<br />
    TEMPERATURE: 16 DEW POINT: 10<br />
    QNH: 996 HPA<br />
    SIGWX: COND SUITABLE FOR A VISUAL APCH.<br />
    2000 FT WIND: FORECAST 320/30KT<br />
    ON FIRST CTC WITH NZNV TWR NOTIFY RCPT OF L.</span
  ><br /><br /><span class="metText"
    >METAR NZNV 062230Z AUTO 35012KT 320V020 43KM FEW140/// BKN170///<br />
    BKN190/// 16/11 Q0996=</span
  ><br /><br /><span class="metText"
    >TAF NZNV 062216Z 0623/0714<br />
    33012KT 20KM -SHRA SCT030 BKN050<br />
    TEMPO 0623/0705 6000 SHRA<br />
    BECMG 0701/0703 27018G30KT<br />
    BECMG 0703/0705 33012KT<br />
    BECMG 0710/0712 03005KT<br />
    2000FT WIND 34030KT =</span
  ><br /><br /><br /><br /><span class="metLocation"
    >NZZC&nbsp;(NEW ZEALAND FIR) </span
  ><br /><br /><span class="metText"
    >NZZC SIGMET 51 VALID 062116/070116 NZKL-<br />
    NZZC NEW ZEALAND FIR SEV MTW FCST WI S4500 E16740 - S4410 E16900 -<br />
    S4240 E17210 - S4500 E17110 - S4600 E17010 - S4500 E16740 FL300/420<br />
    STNR NC=</span
  ><br /><br /><span class="metText"
    >NZZC SIGMET 50 VALID 062101/070101 NZKL-<br />
    NZZC NEW ZEALAND FIR SEV MTW OBS AT 2056Z S4501 E17016 FL370 STNR<br />
    NC=</span
  ><br /><br /><span class="metText"
    >NZZC SIGMET 47 VALID 062039/070039 NZKL-<br />
    NZZC NEW ZEALAND FIR FRQ TS OBS WI S4120 E17100 - S4310 E17210 -<br />
    S4410 E17040 - S4150 E17000 - S4120 E17100 TOP FL350 MOV NE 05KT NC=</span
  ><br /><br /><span class="metText"
    >NZZC SIGMET 46 VALID 062006/070006 NZKL-<br />
    NZZC NEW ZEALAND FIR SEV TURB OBS AT 2001Z S4336 E17224 3000FT=</span
  ><br /><br /><span class="metText"
    >NZZC SIGMET 45 VALID 061927/062327 NZKL-<br />
    NZZC NEW ZEALAND FIR SEV TURB OBS AT 1924Z S4321 E17218 6000FT=</span
  ><br /><br /><span class="metText"
    >NZZC SIGMET 44 VALID 061926/062326 NZKL-<br />
    NZZC NEW ZEALAND FIR SEV TURB FCST WI S4040 E17510 - S4100 E17620 -<br />
    S4140 E17530 - S4140 E17140 - S4040 E17220 - S4040 E17510 SFC/6000FT<br />
    STNR INTSF=</span
  ><br /><br /><span class="metText"
    >NZZC SIGMET 42 VALID 061925/062325 NZKL-<br />
    NZZC NEW ZEALAND FIR SEV TURB FCST WI S4350 E17310 - S4140 E17420 -<br />
    S4140 E17140 - S4300 E17040 - S4400 E16820 - S4600 E16600 - S4650<br />
    E16940 - S4350 E17310 SFC/FL120 STNR INTSF=</span
  ><br /><br /><br /><span class="metSectionHeader">AAW REPORTS</span
  ><br /><br /><span class="metLocation">FN (FAR NORTH)</span><br /><br /><span
    class="metText metPreformatted"
    >AVIATION AREA FN VALID 2100 TO 1200 UTC<br />
    1000 33015<br />
    3000 32020<br />
    5000 31020 PS13<br />
    7000 31020 PS09<br />10000 31020 PS03<br /></span
  ><br /><span class="metLocation">TA (TAMAKI)</span><br /><br /><span
    class="metText metPreformatted"
    >AVIATION AREA TA VALID 2100 TO 1200 UTC<br />
    1000 33015<br />
    3000 31020<br />
    5000 31025 PS11<br />
    7000 30025 PS08<br />10000 30020 PS03<br /></span
  ><br /><span class="metLocation">TK (TE KUITI)</span><br /><br /><span
    class="metText metPreformatted"
    >AVIATION AREA TK VALID 2100 TO 1200 UTC<br />
    1000 35015<br />
    3000 32025<br />
    5000 31030 PS10<br />
    7000 30030 PS07<br />10000 30035 PS01<br /></span
  ><br /><span class="metLocation">ED (EDGECUMBE)</span><br /><br /><span
    class="metText metPreformatted"
    >AVIATION AREA ED VALID 2100 TO 1200 UTC<br />
    1000 32015<br />
    3000 31020<br />
    5000 30030 PS11<br />
    7000 31030 PS08<br />10000 30025 PS03<br /></span
  ><br /><span class="metLocation">CP (CENTRAL PLATEAU)</span><br /><br /><span
    class="metText metPreformatted"
    >AVIATION AREA CP VALID 2100 TO 1200 UTC<br />
    3000 33025<br />
    5000 31035 PS11<br />
    7000 30035 PS08<br />10000 30030 PS02<br /></span
  ><br /><span class="metLocation">MH (MAHIA)</span><br /><br /><span
    class="metText metPreformatted"
    >AVIATION AREA MH VALID 2100 TO 1200 UTC<br />
    1000 32020<br />
    3000 31025<br />
    5000 31035 PS12<br />
    7000 31030 PS09<br />10000 31025 PS04<br /></span
  ><br /><span class="metLocation">SA (SANSON)</span><br /><br /><span
    class="metText metPreformatted"
    >AVIATION AREA SA VALID 2100 TO 1200 UTC<br />
    1000 33030<br />
    3000 32040<br />
    5000 31035 PS12<br />
    7000 30035 PS08<br />10000 30035 PS02<br /></span
  ><br /><span class="metLocation">DV (DANNEVIRKE)</span><br /><br /><span
    class="metText metPreformatted"
    >AVIATION AREA DV VALID 2100 TO 1200 UTC<br />
    1000 32020<br />
    3000 31030<br />
    5000 30035 PS12<br />
    7000 30030 PS09<br />10000 30030 PS03<br /></span
  ><br /><span class="metLocation">ST (STRAITS)</span><br /><br /><span
    class="metText metPreformatted"
    >AVIATION AREA ST VALID 2100 TO 1200 UTC<br />
    BECOMING 0800-1000<br />
    1000 34035<br />
    3000 32045<br />
    5000 32050 PS10 32040 PS11<br />
    7000 31050 PS08 31040 PS08<br />10000 31050 PS02<br /></span
  ><br /><span class="metLocation">TN (TASMAN)</span><br /><br /><span
    class="metText metPreformatted"
    >AVIATION AREA TN VALID 2100 TO 1200 UTC<br />
    BECOMING 0300-0400 0500 1100<br />
    1000 35025 29015<br />
    3000 33035 29020<br />
    5000 32040 PS09 30030 PS09<br />
    7000 32040 PS06 31030 PS06<br />10000 32050 ZERO<br /></span
  ><br /><span class="metLocation">WW (WINDWARD)</span><br /><br /><span
    class="metText metPreformatted"
    >AVIATION AREA WW VALID 2100 TO 1200 UTC<br />
    BECOMING 2300-0000 0400-0600<br />
    1000 36030 31015<br />
    3000 33040 31025 31015<br />
    5000 31040 PS07 31025 PS05<br />
    7000 32040 PS03 31030 PS01<br />10000 32050 MS03<br /></span
  ><br /><span class="metLocation">KA (KAIKOURAS)</span><br /><br /><span
    class="metText metPreformatted"
    >AVIATION AREA KA VALID 2100 TO 1200 UTC<br />
    3000 32035<br />
    5000 32045 PS08<br />
    7000 32060 PS06<br />10000 31060 PS01<br /></span
  ><br /><span class="metLocation">AL (ALPS)</span><br /><br /><span
    class="metText metPreformatted"
    >AVIATION AREA AL VALID 2100 TO 1200 UTC<br />
    BECOMING 0300-0400<br />
    3000 34030<br />
    5000 33045 PS06 32030 PS03<br />
    7000 32050 PS02 32040 MS01<br />10000 32060 MS04<br /></span
  ><br /><span class="metLocation">PL (PLAINS)</span><br /><br /><span
    class="metText metPreformatted"
    >AVIATION AREA PL VALID 2100 TO 1200 UTC<br />
    BECOMING 0200 0700-0800 0900<br />
    1000 33030 29010 12010<br />
    3000 32045 31035 32010<br />
    5000 31060 PS10 31045 PS09 31035 PS07<br />
    7000 31065 PS07 31055 PS06 30045 PS05<br />10000 31065 PS02<br /></span
  ><br /><span class="metLocation">CY (CLYDE)</span><br /><br /><span
    class="metText metPreformatted"
    >AVIATION AREA CY VALID 2100 TO 1200 UTC<br />
    3000 32035<br />
    5000 32040 PS04<br />
    7000 32045 ZERO<br />10000 32050 MS06<br /></span
  ><br /><span class="metLocation">GE (GORE)</span><br /><br /><span
    class="metText metPreformatted"
    >AVIATION AREA GE VALID 2100 TO 1200 UTC<br />
    BECOMING 0200<br />
    1000 32020<br />
    3000 32030<br />
    5000 31035 PS04<br />
    7000 31040 ZERO 31030 MS01<br />10000 31045 MS07<br /></span
  ><br /><span class="metLocation">FD (FIORDS)</span><br /><br /><span
    class="metText metPreformatted"
    >AVIATION AREA FD VALID 2100 TO 1200 UTC<br />
    1000 32025<br />
    3000 32035<br />
    5000 32035 PS02<br />
    7000 32040 MS02<br />10000 32045 MS08<br /></span
  ><br /><span class="metText metPreformatted">
    ----------------<br />NOTE: ALL HEIGHTS ARE IN FEET AMSL<br /></span
  ><br /><span class="metNoInfoHeader"
    >NO MET REPORTS FOR THE FOLLOWING LOCATIONS : </span
  ><br /><br /><span class="metNoInfoList"
    >ATIS&nbsp;:&nbsp;NZKK&nbsp;NZWR&nbsp;NZWP&nbsp;NZWK&nbsp;NZAP&nbsp;NZWU&nbsp;NZPP&nbsp;NZMS&nbsp;NZWS&nbsp;NZHK&nbsp;NZTU&nbsp;NZMF&nbsp;NZWF&nbsp;NZOU&nbsp;NZMO&nbsp;<br /></span
  ><span class="metNoInfoList">METAR&nbsp;:&nbsp;NZWP&nbsp;<br /></span
  ><span class="metNoInfoList">CYCLONE SIGMET&nbsp;:&nbsp;NZZC&nbsp;<br /></span
  ><span class="metNoInfoList"
    >VOLCANIC SIGMET&nbsp;:&nbsp;NZZC&nbsp;<br /></span
  ><br /><br />END.
</div>

`;

async function getBriefingData() {
  const pages = {
    login:
      "https://www.ifis.airways.co.nz/secure/script/user_reg/login.asp?RedirectTo=%2F",
    areaBriefing:
      "https://www.ifis.airways.co.nz/script/other/simple_briefing.asp"
  };

  const selectors = {
    username: "input[name=UserName]",
    password: "input[name=Password]",
    submit: "input[value=Submit]",

    homepage: "#home-photo",

    briefingAreas: "input[name=Areas]",
    aawAreas: "input[name=MetAviationAreas]",
    ATIS: "input[name=ATIS]",
    METAR: "input[name=METAR]",
    TAF: "input[name=TAF]",

    briefingLoaded: ".notamSectionHeader",
    briefingContent: ".aqcResponse"
  };

  const credentials = {
    username: "metscope",
    password: "iamar0bot"
  };

  const startTime = new Date(); // Used for measuring execution time
  console.log("Logging in to IFIS...");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Navigate to login and wait for load
  await page.goto(pages.login);
  await page.waitForSelector(selectors.username);

  // Input login credentials
  await page.click(selectors.username);
  await page.keyboard.type(credentials.username);
  await page.click(selectors.password);
  await page.keyboard.type(credentials.password);

  // Submit login and wait for redirect
  await page.click(selectors.submit);
  await page.waitForSelector(selectors.homepage);
  console.log("Login successful.");

  // Navigate to briefing selection and wait for load
  console.log("Requesting briefing...");
  await page.goto(pages.areaBriefing);
  await page.waitForSelector(selectors.briefingAreas);

  // Input briefing request
  await page.click(selectors.ATIS);
  await page.click(selectors.METAR);
  await page.click(selectors.TAF);
  await page.click(selectors.briefingAreas);
  await page.keyboard.type("1 2 3 4 5 6 7 8 9 10"); // All briefing areas
  await page.click(selectors.aawAreas);
  await page.keyboard.type(
    "FN TA ED TK CP MH SA DV ST TN KA WW AL PL FD CY GE"
  ); // All AAW areas

  // Submit brief request and wait for redirect
  await page.click(selectors.submit);
  await page.waitForSelector(selectors.briefingContent, { visible: true });

  // Navigate to same page to ensure all content loads successfully
  await page.goto(`${page.url()}#contentContainer`, {
    waitUntil: "networkidle0"
  });
  console.log("Briefing request successful.");

  // Get html content from page
  const data = await page.content();
  await browser.close();

  // Track execution time
  const endTime = new Date();
  console.log(`Completed in ${(endTime - startTime) / 1000} seconds.`);

  return data;
}

async function parseBriefingContent(html) {
  const $ = cheerio.load(html, { xml: { normalizeWhitespace: false } });

  let aerodromeList = [];
  let allNotams = [];

  $(".notamLocation").each(function(i, elem) {
    let aerodrome = $(this)
      .text()
      .trim();
    aerodromeList.push(aerodrome);
  });

  $(".notamSeries").each(function(i, elem) {
    let item = $(this);
    let series = item.text();
    let validity = item
      .next()
      .text()
      .replace(/&nbsp;/g, " ")
      .trim();
    let text = item
      .next()
      .next()
      .text()
      .replace(/&nbsp;/g, " ")
      .trim();

    let aerodrome = item
      .prevAll(".notamLocation")
      .first()
      .text()
      .trim();

    let notam = { aerodrome, series, validity, text };
    allNotams.push(notam);
  });

  const NOTAMS = aerodromeList.map(aerodrome => {
    const notams = allNotams.filter(n => n.aerodrome === aerodrome);
    return { aerodrome, notams };
  });

  return NOTAMS;
}

(async () => {
  // const html = await getBriefingData();
  const notams = await parseBriefingContent(testHtml);

  // console.log("notams :", notams);
  console.log(JSON.stringify(notams));
})();
