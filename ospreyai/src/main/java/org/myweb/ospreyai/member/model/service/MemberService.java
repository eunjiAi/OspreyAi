package org.myweb.ospreyai.member.model.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.myweb.ospreyai.member.jpa.entity.MemberEntity;
import org.myweb.ospreyai.member.jpa.repository.MemberRepository;
import org.myweb.ospreyai.member.model.dto.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.NoSuchElementException;
import java.util.Optional;

@Slf4j    //Logger 객체 선언임, 별도의 로그객체 선언 필요없음, 제공되는 레퍼런스는 log 임
@Service
@RequiredArgsConstructor	//매개변수 있는 생성자를 반드시 실행시켜야 한다는 설정임
@Transactional
public class MemberService {
	//jpa 가 제공하는 기본 메소드와 추가한 메소드 사용
	private final MemberRepository memberRepository;
	private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

	// id로 회원 정보 검색
	public Member selectMember(String userId) {
		Optional<MemberEntity> entityOptional = memberRepository.findByMemberId(userId);

		// 데이터가 없을 경우 예외 처리
		return entityOptional
				.map(MemberEntity::toDto) // Optional로 안전하게 DTO 변환
				.orElseThrow(() -> new NoSuchElementException("해당 아이디를 조회할 수 없습니다 : " + userId));
	}

	//구글 이메일로 회원 정보 조회
	public Member findGoogleEmail(String email) {
		Optional<MemberEntity> entityOptional =  memberRepository.findByGoogle(email);

		return entityOptional
				.map(MemberEntity::toDto) // Optional로 안전하게 DTO 변환
				.orElseThrow(() -> new NoSuchElementException("해당 구글정보를 조회할 수 없습니다 : " + email));
	}

	//네이버 이메일로 회원 정보 조회
	public Member findNaverEmail(String email) {
		Optional<MemberEntity> entityOptional =  memberRepository.findByNaver(email);

		return entityOptional
				.map(MemberEntity::toDto) // Optional로 안전하게 DTO 변환
				.orElseThrow(() -> new NoSuchElementException("해당 네이버정보를 조회할 수 없습니다 : " + email));
	}

	//카카오 이메일로 회원 정보 조회
	public Member findKakaoEmail(String email) {
		Optional<MemberEntity> entityOptional =  memberRepository.findByKakao(email);

		return entityOptional
				.map(MemberEntity::toDto) // Optional로 안전하게 DTO 변환
				.orElseThrow(() -> new NoSuchElementException("해당 카카오정보를 조회할 수 없습니다 : " + email));
	}


	//회원가입시 id 중복 검사용
	public int selectCheckId(String memberId) {
		// id 회원정보 가져와서 uuid 추출
		String uuid = memberRepository.findByMemberId(memberId)
				.map(MemberEntity::getUuid)
				.orElse(null);

		return (uuid != null && memberRepository.existsById(uuid)) ? 1 : 0;
	}

	//회원 가입
	@Transactional
	public int insertMember(Member member) {
		try{
			memberRepository.save(member.toEntity()).toDto();
			return 1;
		}catch (Exception e) {
			log.error(e.getMessage());
			return 0;
		}
	}

	//닉네임 조회
	public String getNicknameByUserId(String userid) {
		return memberRepository.findByMemberId(userid)
				.map(MemberEntity::getNickname) // 메서드 참조 대신 람다식 사용
				.orElseThrow(() -> new IllegalArgumentException("해당 사용자 ID를 찾을 수 없습니다: " + userid));
	}

	//회원정보 수정
	@Transactional
	public int updateMember(Member member) {
		try{
			memberRepository.save(member.toEntity()).toDto();
			return 1;
		}catch (Exception e) {
			log.error(e.getMessage());
			return 0;
		}
	}

	public boolean checkPassword(String userId, String inputPassword) {
		Member member = memberRepository.findByMemberId(userId)
				.orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다.")).toDto();
		log.info("checkPassword() : " + member);

		return bCryptPasswordEncoder.matches(inputPassword, member.getPw());
	}


	@Transactional
	public int deleteMember(String userId) {
		try {
			memberRepository.deleteById(userId);
			return 1;
		} catch (Exception e) {
			log.info(e.getMessage());
			return 0;
		}
	}

	public Member selectUuid(String uuid) {
		return memberRepository.findById(uuid).get().toDto();
	}


	//관리자용 ******************************************
	public int selectListCount() {
		return (int)memberRepository.count();
	}

	public ArrayList<Member> selectList(Pageable pageable) {
		Page<MemberEntity> entityList = memberRepository.findAll(pageable);
		ArrayList<Member> list = new ArrayList<>();
		for(MemberEntity entity : entityList){
			//관리자가 아닌 회원만 리스트에 저장
			if(entity.getAdminYn().equals("N")) {
				list.add(entity.toDto());
			}
		}
		return list;
	}

	/*public Page<Member> selectList(Pageable pageable) {
		Page<MemberEntity> entityList = memberRepository.findAll(pageable);  //jpa 제공
		return entityList.map(MemberEntity::toDto); // MemberEntity의 toDto() 메서드를 사용
	}*/

	public int updateLoginOK(String uuid, String loginOk) {
		try {
			Member updateMember = memberRepository.findById(uuid).get().toDto();
			updateMember.setLoginOk(loginOk);
			memberRepository.save(updateMember.toEntity());  //jpa 제공
			return 1;
		}catch (Exception e) {
			log.error(e.getMessage());
			return 0;
		}
	}

	//검색 카운트 관련 ------------------------------------------------------------------
//	public int selectSearchUserIdCount(String keyword) {
//		// 추가 작성해서 사용 : 리포지토리 인터페이스에 추가 작성하
//		return (int) memberRepository.countSearchUserId(keyword);
//	}
//
//
//	public int selectSearchGenderCount(String keyword) {
//		// 추가 작성해서 사용 : 리포지토리 인터페이스에 추가 작성하
//		return (int) memberRepository.countSearchGender(keyword);
//	}
//
//
//	public int selectSearchAgeCount(int age) {
//		// 추가 작성해서 사용 : 리포지토리 인터페이스에 추가 작성하
//		return (int) memberRepository.countSearchAge(age);
//	}
//
//
//	public int selectSearchEnrollDateCount(Date begin, Date end) {
//		// 추가 작성해서 사용 : 리포지토리 인터페이스에 추가 작성하
//		return (int) memberRepository.countSearchDate(begin, end);
//	}
//
//
//	public int selectSearchLoginOKCount(String keyword) {
//		// 추가 작성해서 사용 : 리포지토리 인터페이스에 추가 작성하
//		return (int) memberRepository.countSearchLoginOK(keyword);
//	}

	//검색 관련 목록 조회용 --------------------------------------------------------------------

//	public ArrayList<Member> selectSearchUserId(String keyword, Pageable pageable) {
//		//추가해서 사용함 :
//		List<MemberEntity> page = memberRepository.findSearchUserId(keyword, pageable);
//		ArrayList<Member> list = new ArrayList<>();
//		for(MemberEntity entity : page){
//			list.add(entity.toDto());
//		}
//		return list;
//	}
//
//
//	public ArrayList<Member> selectSearchGender(String keyword, Pageable pageable) {
//		//추가해서 사용함 :
//		List<MemberEntity> page = memberRepository.findSearchGender(keyword, pageable);
//		ArrayList<Member> list = new ArrayList<>();
//		for(MemberEntity entity : page){
//			list.add(entity.toDto());
//		}
//		return list;
//	}
//
//
//	public ArrayList<Member> selectSearchAge(int age, Pageable pageable) {
//		//추가해서 사용함 :
//		List<MemberEntity> page = memberRepository.findSearchAge(age, pageable);
//		ArrayList<Member> list = new ArrayList<>();
//		for(MemberEntity entity : page){
//			list.add(entity.toDto());
//		}
//		return list;
//	}
//
//
//	public ArrayList<Member> selectSearchEnrollDate(Date begin, Date end, Pageable pageable) {
//		//추가해서 사용함 :
//		List<MemberEntity> page = memberRepository.findSearchDate(begin, end, pageable);
//		ArrayList<Member> list = new ArrayList<>();
//		for(MemberEntity entity : page){
//			list.add(entity.toDto());
//		}
//		return list;
//	}
//
//
//	public ArrayList<Member> selectSearchLoginOK(String keyword, Pageable pageable) {
//		//추가해서 사용함
//		List<MemberEntity> page = memberRepository.findSearchLoginOK(keyword, pageable);
//		ArrayList<Member> list = new ArrayList<>();
//		for(MemberEntity entity : page){
//			list.add(entity.toDto());
//		}
//		return list;
//	}

}
