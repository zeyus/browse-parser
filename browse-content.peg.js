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
    return audience.trim()
}

tags= tags:(metatag / titletag)* {
    return tags
}

metatag= ws* l:"<meta" m:[^>]+ r:">" not_nl* nl? {
    return (l + m.join('') + r).trim()
}

titletag= l:"<title>" m:[^<]+ r:"</title>" nl? {
    return (l + m.join('') + r).trim()
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
        throw new Error('Course count mismatch in ' + type + ' - expected ' + count + ', got ' + courses.length + ': ' + courses.map(JSON.stringify));
    }
    return {type: type, courses: courses}
}

course_type_name=
    'Short courses' /
    'TAFE certificates and ' [Dd] 'iplomas' { return 'TAFE certificates and diplomas'} /
    'Bachelor degrees (undergraduate)' /
    'Postgraduate'

course= nl* title:course_title link:course_link data:course_data* teaser:course_teaser {
    return {title: title, link: link, teaser: teaser, data: data}
}

course_title= ws* award:course_award title:[^<]+ {
    return award + title.join('').trim()
}

course_link= '<link to: ' link:[^>]+ '>' not_nl* nl* {
    return link.join('')
}

course_data= ws* key:[A-Za-z]+ ': ' value:not_nl+ nl+ {
    var ret = {}
    ret[key.join('').toLowerCase().trim()] = value.join('').trim()
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

studyarea_summary= nl* title:indented_line nl* image:studyarea_image? teaser:indented_lines_with_dot {
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

promo= promo:(event / testimonial / campaign / video / ebrochure / promo_other) nl* {
    return promo
}

promo_other= ws* promo:promo_type rest:not_nl+ nl+ lines:indented_lines* {
    return {
        type: promo.type,
        value: [promo.first + rest.join('')].concat(lines).join('\r\n')
    }
}

promo_type=
    match:'You have the opportunity ' {
        return {type: 'exchange', first: match}
    } /
    match:'VU is focused on the delivery' {
        return {type: 'apprenticeship', first: match}
    } /
    match:'Tuition fees ' {
        return {type: 'tuition', first: match}
    } /
    match:'When I started at VU English' {
        return {type: 'vu_english', first: match}
    } /
    match:'The Victoria Graduate School' {
    return {type: 'vgsb', first: match}
    } /
    match:'Victoria University (VU) postgraduate programs' {
        return {type: 'postgrad', first: match}
    } /
    match:'VU is a recognised leader' {
        return {type: 'hospitality', first: match}
    } /
    match:'Find out about how' {
        return {type: 'opportunity', first: match}
    } /
    match:'VU offers courses' {
        return {type: 'immigration_law', first: match}
    } /
    match:'Demand for aged care' {
        return {type: 'aged_care', first: match}
    } /
    match:'Our students provide treatments' {
        return {type: 'beauty', first: match}
    } /
    match:'Some students are eligible' {
        return {type: 'cfp', first: match}
    } /
    match:'We offer a wide' {
        return {type: 'short_course', first: match}
    } /
    match:'Gain skills and knowledge' {
        return {type: 'it', first: match}
    } /
    match:'Our $68 million' {
        return {type: 'sport', first: match}
    } /
    match:'Victoria Universitys institute' {
        return {type: 'supply_chain', first: match}
    } /
    match:'Strong industry connections' {
        return {type: 'film_tv', first: match}
    } /
    match:'Gain an in' {
        return {type: 'marketing', first: match}
    } /
    match:'Our courses can' {
        return {type: 'medical', first: match}
    } /
    match:'VU has cutting' {
        return {type: 'music', first: match}
    } /
    match:'Clinical learning' {
        return {type: 'nursing', first: match}
    } /
    match:'Our courses have' {
        return {type: 'nutrition', first: match}
    } /
    match:'Learn to assess' {
        return {type: 'osteo', first: match}
    } /
    match:'Clinical placement' {
        return {type: 'paramedic', first: match}
    } /
    match:'http://www.istockphoto.com/stock-photo-1931405' {
        return {type: 'legal', first: match}
    } /
    match:'Develop the technical' {
        return {type: 'pm', first: match}
    } /
    match:'The Victoria University Psychology' {
        return {type: 'psych', first: match}
    } /
    match:'VU champions Problem' {
        return {type: 'pbl', first: match}
    } /
    match:'As a Victoria' {
        return {type: 'social_work', first: match}
    } /
    match:'Develop specialist skills' {
        return {type: 'surveyor', first: match}
    } /
    match:'VU students get work experience' {
        return {type: 'work_experience', first: match}
    } /
    match:'VU offers' {
        return {type: 'youth_work', first: match}
    }

event= ws* 'Event' nl+ event_lines:indented_lines {
    return {type: 'event', value: event_lines}
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

video_link= url:('http' 's'? '://www.youtube.com/watch?v=') code:not_nl+ nl+ {
    return url.join('') + code.join('')
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
    return line.trim()
}

indented_line_with_dot= ws line:line_with_dot {
    return line.trim()
}

indented_lines= lines:indented_line+ {
    return lines.join('\r\n').trim()
}

indented_lines_with_dot= lines:indented_line_with_dot+ {
    return lines.join('\r\n').trim()
}

indented_or_empty_lines= lines:(nl / indented_lines)+ {
    return lines.join('\r\n').trim()
}

not_nl = [^\r\n]
nl = [\r\n]
ws = [ \t]
wsnl = ws / nl
