package org.myweb.ospreyai.faq.model.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.myweb.ospreyai.faq.jpa.entity.FaqEntity;
import org.myweb.ospreyai.faq.jpa.repository.FaqRepository;
import org.myweb.ospreyai.faq.model.dto.Faq;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class FaqService {
    private final FaqRepository faqRepository;

    public Map<String, Faq> selectFaq(int faqId) {
        List<FaqEntity> list = faqRepository.findFaq(faqId);
        log.info("selectFaq : " + list);
        Map<String, Faq> map = new HashMap<>();
        for (FaqEntity faqEntity : list) {
            if (faqEntity.getFaqQa().equals("Q")){
                map.put("Q", faqEntity.toDto());
            }else if (faqEntity.getFaqQa().equals("A")){
                map.put("A", faqEntity.toDto());
            }
        }
        return map;
    }

    public void updateAddReadCount(int faqId) {
        Optional<FaqEntity> entity = faqRepository.findById(faqId);
        FaqEntity faqEntity = entity.get();
        log.info("addReadCount : " + faqEntity);
        faqEntity.setViewCount(faqEntity.getViewCount() + 1);
        faqRepository.save(faqEntity);	//jpa가 제공
    }

//    public int selectListCount() {
//        //jpa 가 제공하는 메소드 사용
//        //count() : long
//        //테이블의 전체 행 수를 반환함
//        return faqRepository.findCount();
//    }

//    private ArrayList<Faq> toList(List<FaqEntity> entityList) {
//        //컨트롤러로 리턴할 ArrayList<Faq> 타입으로 변경 처리 필요함
//        ArrayList<Faq> list = new ArrayList<>();
//        //Page 안의 FaqEntity 를 Faq 로 변환해서 리스트에 추가 처리함
//        for(FaqEntity entity : entityList){
//            list.add(entity.toDto());
//        }
//        return list;
//    }

//    public ArrayList<Faq> selectList(Pageable pageable) {
//        return toList(faqRepository.findList(pageable));
//    }

    public int insertfaq(Faq faq) {
        //save(Entity) : Entity 가 반환되는 메소드 사용, 실패하면 에러 발생임
        //jpa 가 제공, insert 문, update 문 처리
        try {
            faq.setFaqId(faqRepository.findLastFaqId() + 1);  //추가한 메소드
            faq.setQnaId(faqRepository.findLastFaqId() + 1);  //추가한 메소드
            faq.setFaqQa("Q");
            faqRepository.save(faq.toEntity());  //jpa 제공
            return 1;
        }catch(Exception e){
            log.info(e.getMessage());
            return 0;
        }
    }

    public int insertfaqa(Faq faq) {
        try {
            faq.setFaqId(faqRepository.findLastFaqId() + 1);  //추가한 메소드
            faq.setFaqQa("A");
            faqRepository.save(faq.toEntity());  //jpa 제공
            return 1;
        }catch(Exception e){
            log.info(e.getMessage());
            return 0;
        }
    }

    public int deletefaq(int faqId) {
        try {
            faqRepository.deleteFaq(faqId);
            return 1;
        }catch(Exception e){
            log.info(e.getMessage());
            return 0;
        }
    }

    public int lastFaqId() {
        return faqRepository.findLastFaqId();
    }

    public int selectListCountByCategory(String category) {
        return faqRepository.countByCategory(category);
    }

    public ArrayList<FaqEntity> selectListByCategory(Pageable pageable, String category) {
        List<FaqEntity> list = faqRepository.findByCategory(category, pageable);
        return new ArrayList<>(list);
    }
}
