start=
    topic / studyarea

topic=
    topic_residents topic_international?

studyarea= .* {
    return 'studyarea?'
}

topic_residents=
    heading_residents
    tags
    intro
    careers
    colleges
    courses
    (specialisations / studyareas)
    promos

topic_international=
    heading_international
    tags
    intro
    careers
    colleges
    pathways?
    courses
    (specialisations / studyareas)
    contacts
    promos

heading_residents= "Residents " not_nl+ nl {
    return {name: 'audience', value: 'Residents'}
}

heading_international= "International " not_nl+ nl {
    return {name: 'audience', value: 'International'}
}

tags= tags:(metatag* titletag* metatag*) {
    return {name: 'tags', value: tags}
}

metatag= ws* l:"<meta" m:[^>]+ r:">" not_nl* nl? {
    return {tag: l + m.join('') + r }
}

titletag= l:"<title>" m:[^<]+ r:"</title>" nl? {
    return {tag: l + m.join('') + r }
}

intro= nl* intro:indented_lines  {
    return {name: 'intro', value: intro}
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

courses= nl* 'Courses' ws* nl ws* '<Insert courses ' [t]? 'able as per wireframe>' wsnl+ courses:course_type+ {
    return {name: 'course_groups', value: courses}
}

course_type= nl* ws* type:course_type_name ' (' count:[0-9]+ ' course' [s]? ')' courses:course* {
    return {type: type, count: count.join(''), courses: courses}
}

course_type_name=
    'Short courses' /
    'TAFE certificates and ' [Dd] 'iplomas' /
    'Bachelor degrees (undergraduate)' /
    'Postgraduate'

course= nl* title:course_title data:course_data* teaser:course_teaser {
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
    'Advanced Diploma' /
    'Advanced Skills' /
    'Alcohol and Other Drugs' /
    'Associate Degree' /
    'Bachelor o' /
    'BAS Agent' /
    'Basic' /
    'Beginner Skills' /
    'Bridal' /
    'Build' /
    'CCNA' /
    'Certificate' /
    'Cisco' /
    'Coffee' /
    'Course in' /
    'CPR' /
    'Crystal' /
    'Diploma' /
    'DIY' /
    'Doctor' /
    'Dual Diagnosis' /
    'Engineering' /
    'Food' /
    'Foundation' /
    'Furniture' /
    'Graduate' /
    'Home' /
    'Hot Stone' /
    'Immigration' /
    'Intermediate Skills' /
    'Introduction' /
    'ITIL' /
    'Licensed' /
    'Linux' /
    'Make-Up' /
    'Master' /
    'MCITP' /
    'Mental Health' /
    'National' /
    'Open Cable' /
    'Perform' /
    'Photographic' /
    'Portable' /
    'Prepare' /
    'Professional Course' /
    'Recognise' /
    'Registered' /
    'Responsible' /
    'Restricted' /
    'Save Money' /
    'Sculptural' /
    'Serve' /
    'Solar' /
    'Test' /
    'Vocational' /
    'Welding' /
    'Workplace'

specialisations= nl* '<h2>Specialisations in ' not_nl+ studyareas:studyarea_summary* {
    return {name: 'studyareas', value: studyareas}
}

studyareas= nl* '<h2>Study areas' not_nl+ studyareas:studyarea_summary* {
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


promos= nl* promos:promo+ {
    return {name:'promos', value: promos}
}

promo= promo:(event / testimonial / campaign / video / ebrochure / tuition_promo / vu_english_promo) nl* {
    return promo
}

event= 'Event' nl+ event_lines:indented_lines {
    return {type: 'event', value: event_lines}
}

tuition_promo= first:'Tuition fees ' rest:not_nl+ nl+ lines:indented_lines {
    return {type: 'tuition', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

vu_english_promo= first:'When I started at VU English' rest:not_nl+ nl+ lines:indented_lines {
    return {type: 'vu_english', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

ebrochure= first:'Create a course e-brochure' nl+ rest:indented_lines {
    return {type: 'ebrochure', value: [first].concat(rest).join('\r\n')}
}

testimonial= '"' testimonial_lines:testimonial_lines {
    return {type: 'testimonial', value: testimonial_lines}
}

testimonial_lines= first:line rest:indented_lines? {
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
