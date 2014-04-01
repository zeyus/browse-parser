start=
    (topic / nothing)+

topic=
    audience:heading
    tags:tags
    intro:intro
    careers:careers
    colleges:colleges
    pathways:pathways?
    course_groups:course_groups
    studyareas:studyareas
    contacts:contacts?
    promos:promos {
        return {
            'audience': audience,
            'tags': tags,
            'intro': intro,
            'careers': careers,
            'colleges': colleges,
            'pathways': pathways,
            'course_groups': course_groups,
            'studyareas': studyareas,
            'contacts': contacts,
            'promos': promos
        }
    }

nothing=
    audience:heading ws* 'No' .* {
        return {'audience': audience}
    }

heading= audience:("Residents" / "International") not_nl+ nl {
    return audience
}

tags= tags:(metatag / titletag)* {
    return tags
}

metatag= ws* l:"<meta" m:[^>]+ r:">" not_nl* nl? {
    return {tag: l + m.join('') + r }
}

titletag= l:"<title>" m:[^<]+ r:"</title>" nl? {
    return {tag: l + m.join('') + r }
}

intro= nl* intro:indented_lines  {
    return intro
}

careers= nl* '<h2>Careers' not_nl+ nl careers:indented_lines {
    return careers
}

colleges= nl* ('<h2>'? ' '? 'Colleges' '</h2>'?) nl colleges:indented_lines {
    return colleges
}

pathways= nl* '<h2>Pathways</h2>' nl pathways:indented_lines {
    return pathways
}

course_groups= nl* 'Courses' ws* nl ws* '<Insert courses ' [t]? 'able as per wireframe>' wsnl+ courses:course_type+ {
    return courses
}

course_type= nl* ws* type:course_type_name ' (' count:[0-9]+ ' course' [s]? ')' courses:course* {
    count = parseInt(count.join(''), 10);
    if(count != courses.length) {
        throw new Error('Course count mismatch in ' + type + ': ' + courses.map(JSON.stringify));
    }
    return {type: type, courses: courses}
}

course_type_name=
    'Short courses' /
    'TAFE certificates and ' [Dd] 'iplomas' /
    'Bachelor degrees (undergraduate)' /
    'Postgraduate'

course= nl* title:course_title data:course_data* teaser:course_teaser* {
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

course_teaser= indented_lines

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
    'Composting' /
    'Course in' /
    'CPR' /
    'Create' /
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
    'Growing' /
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
    'Propagating' /
    'Pruning' /
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

studyareas= studyarea_heading studyareas:studyarea_summary* {
    return studyareas
}

studyarea_heading= nl* '<h2>'? ('Study areas' / 'Specialisations in' / 'Related study areas') not_nl+

studyarea_summary= nl* title:indented_line nl? image:studyarea_image? teaser:indented_lines_with_dot {
    return {title: title, image: image, teaser: teaser}
}

studyarea_image= ws* protocol:'http://' url:not_nl+ nl+ {
    return protocol + url.join('')
}


contacts= contacts:contact* {
    return contacts
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
    return promos
}

promo= promo:(event / testimonial / campaign / video / ebrochure / tuition_promo / vu_english_promo / exchange_promo / apprenticeship_promo / vgsb_promo / postgrad_promo / hospitality_promo / opportunity_promo / immigration_promo / aged_care_promo / beauty_promo / cfp_promo / short_course_promo / it_promo) nl* {
    return promo
}

event= 'Event' nl+ event_lines:indented_lines {
    return {type: 'event', value: event_lines}
}

exchange_promo= first:'You have the opportunity ' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'exchange', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

apprenticeship_promo= first:'VU is focused on the delivery' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'apprenticeship', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

tuition_promo= first:'Tuition fees ' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'tuition', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

vu_english_promo= first:'When I started at VU English' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'vu_english', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

vgsb_promo= first:'The Victoria Graduate School' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'vgsb', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

postgrad_promo= first:'Victoria University (VU) postgraduate programs' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'postgrad', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

hospitality_promo= first:'VU is a recognised leader' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'hospitality', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

opportunity_promo= first:'Find out about how' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'opportunity', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

immigration_promo= first:'VU offers courses' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'immigration_law', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

aged_care_promo= first:'Demand for aged care' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'immigration_law', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

beauty_promo= first:'Our students provide treatments' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'immigration_law', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

cfp_promo= first:'Some students are eligible' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'cfp', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

short_course_promo= first:'We offer a wide' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'short_course', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

it_promo= first:'Gain skills and knowledge' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'it', value: [first + rest.join('')].concat(lines).join('\r\n')}
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

campaign_title= '<h3>' title:[^<]+ not_nl+ nl+ {
    return title.join('')
}

video= link:video_link text:indented_lines {
    return {type: 'video', value: {link: link, text: text}}
}

video_link= url:'http' 's'? '://www.youtube.com/watch?v=' code:not_nl+ nl+ {
    return url + code.join('')
}

line= c:not_nl* nl {
    return c.join('')
}

line_with_dot= sentences:sentence+ not_nl* nl {
    return sentences.join(' ')
}

sentence= c:[^\r\n\.]+ '.' {
    return c.join('') + '.'
}

indented_line= ws line:line {
    return line
}

indented_line_with_dot= ws line:line_with_dot {
    return line
}

indented_lines= lines:indented_line+ {
    return lines.join('\r\n')
}

indented_lines_with_dot= lines:indented_line_with_dot+ {
    return lines.join('\r\n')
}

indented_or_empty_lines= lines:(nl / indented_lines)+ {
    return lines.join('\r\n')
}

not_nl = [^\r\n]
nl = [\r\n]
ws = [ \t]
wsnl = ws / nl
