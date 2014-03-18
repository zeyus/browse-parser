start=
    topic / studyarea

topic=
    topic_residents
    topic_international?

studyarea= .*

topic_residents=
    heading_residents
    tags
    intro
    careers
    colleges
    courses
    studyareas
    promos?

topic_international=
    heading_international
    tags
    intro
    careers
    colleges
    pathways?
    courses
    specialisations
    contacts
    promos?

heading_residents= "Residents " not_nl+ nl {
    return {name: 'audience', value: 'Residents'}
}

heading_international= "International " not_nl+ nl {
    return {name: 'audience', value: 'International'}
}

tags= tags:(metatag* titletag* metatag*) {
    return {name: 'tags', value: tags}
}

metatag= ws* l:"<meta" m:[^>]+ r:">" nl? {
    return {tag: l + m.join('') + r }
}

titletag= l:"<title>" m:[^<]+ r:"</title>" nl? {
    return {tag: l + m.join('') + r }
}

intro= ws* intro:[^<]* {
    return {name: 'intro', value: intro.join('')}
}

careers= nl* '<h2>Careers' not_nl+ nl careers:indented_lines {
    return {name: 'careers', value: careers}
}

colleges= nl* '<h2>Colleges</h2>' nl colleges:indented_lines {
    return {name: 'colleges', value: colleges}
}

pathways= nl* '<h2>Pathways</h2>' nl pathways:indented_lines {
    return {name: 'pathways', value: pathways}
}

courses= nl* 'Courses' nl ws* '<Insert courses ' [t]? 'able as per wireframe>' nl+ courses:course_type+ {
    return {name: 'course_groups', value: courses}
}

course_type= nl* ws* type:course_type_name ' (' count:[0-9]+ ' course' [s]? ')' courses:course* {
    return {type: type, count: count.join(''), courses: courses}
}

course_type_name=
    'Short courses' /
    'TAFE certificates and diplomas' /
    'Bachelor degrees (undergraduate)' /
    'Postgraduate'

course= nl* title:course_title data:course_data+ teaser:course_teaser {
    return {title: title, teaser: teaser, data: data}
}

course_title= ws* award:course_award title:not_nl+ nl+ {
    return award + title.join('')
}

course_data= ws* key:[A-Za-z]+ ': ' value:not_nl+ nl+ {
    var ret = {}
    ret[key.join('').toLowerCase()]=value.join('')
    return ret
}


course_teaser= ws* teaser:not_nl+ wsnl+ {
    return teaser.join('')
}

course_award=
    'Professional Course' /
    'Certificate' /
    'Diploma' /
    'Advanced Diploma' /
    'Bachelor' /
    'Graduate' /
    'Vocational' /
    'Master' /
    'Doctor'

specialisations= nl* '<h2>Specialisations in ' [^<]+ '</h2>' studyareas:studyarea_summary* {
    return {name: 'studyareas', value: studyareas}
}
studyareas= nl* '<h2>Study areas</h2>' studyareas:studyarea_summary* {
    return {name: 'studyareas', value: studyareas}
}

studyarea_summary= nl* title:indented_line teaser:indented_lines {
    return {title: title, teaser: teaser}
}

contacts= contacts:contact* {
    return {name: 'contacts', value: contacts}
}

contact= (phone_contact / email_contact / online_contact)

phone_contact= nl* first:'Ring us on' rest:not_nl+ nl* {
    return [first].concat(rest).join('')
}

email_contact= nl* first:'Email us at' rest:not_nl+ nl* {
    return [first].concat(rest).join('')
}

online_contact= nl* first:'Make an online enquiry' rest:not_nl+ nl* {
    return [first].concat(rest).join('')
}


promos= promos:promo+ {
    return {name:'promos', value: promos}
}

promo= nl* promo:(event / testimonial / campaign / video / ebrochure) {
    return promo
}

event= 'Event' nl+ event_lines:indented_lines {
    return {type: 'event', value: event_lines}
}

ebrochure= first:'Create a course e-brochure' nl+ rest:indented_lines {
    return {type: 'ebrochure', value: [first].concat(rest).join('\r\n')}
}

testimonial= '"' testimonial_lines:testimonial_lines {
    return {type: 'testimonial', value: testimonial_lines}
}

testimonial_lines= first:line rest:indented_lines {
    return [first].concat(rest).join('\r\n')
}

campaign= title:campaign_title content:indented_or_empty_lines {
    return {type: 'campaign', value: {title: title, content: content}}
}

campaign_title= '<h3>' title:[^<]+ '</h3>' nl+ {
    return title.join('')
}

video= link:video_link text:indented_lines {
    return {type: 'video', value: {link: link, text: text}}
}

video_link= url:'http://www.youtube.com/watch?v=' code:not_nl+ nl+ {
    return url + code.join('')
}

line= c:not_nl* nl {
    return c.join('')
}

indented_line= ws line:line {
    return line
}

indented_lines= lines:indented_line+ {
    return lines.join('\r\n')
}

indented_or_empty_lines= lines:(nl / indented_lines)+ {
    return lines.join('\r\n')
}

not_nl = [^\r\n]
nl = [\r\n]
ws = [ \t]
wsnl = ws / nl
swallow= .* { return 'end' }
