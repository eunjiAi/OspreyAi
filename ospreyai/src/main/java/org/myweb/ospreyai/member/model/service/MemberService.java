package org.myweb.ospreyai.member.model.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.myweb.ospreyai.member.jpa.entity.MemberEntity;
import org.myweb.ospreyai.member.jpa.repository.MemberRepository;
import org.myweb.ospreyai.member.model.dto.Member;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

	// 일반 Email로 회원 정보 검색
	public Member selectMember(String userId) {
		// 이메일을 기준으로 조회한다고 가정
		Optional<MemberEntity> entityOptional = memberRepository.findByEmail(userId);

		// 데이터가 없을 경우 예외 처리
		return entityOptional
				.map(MemberEntity::toDto) // Optional로 안전하게 DTO 변환
				.orElseThrow(() -> new NoSuchElementException("해당 이메일을 조회할 수 없습니다 : " + userId));
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


	//회원가입시 이메일 중복 검사용
	public int selectCheckEmail(String email) {
		// email로 회원정보 가져와서 uuid 추출
		String uuid = memberRepository.findByEmail(email)
				.map(MemberEntity::getUuid)
				.orElse(null);
		log.info("selectCheckEmail() : " + uuid);

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
		return memberRepository.findByEmail(userid)
				.map(MemberEntity::getNickname) // 메서드 참조 대신 람다식 사용
				.orElseThrow(() -> new IllegalArgumentException("해당 사용자 ID를 찾을 수 없습니다: " + userid));
	}

	//회원정보 수정
	@Transactional
	public int updateMember(Member member) {
		//save() -> 성공시 Entity, 실패시 null 리턴함, JPA 가 제공하는 메소드임
		try{
			memberRepository.save(member.toEntity()).toDto();
			return 1;
		}catch (Exception e) {
			log.error(e.getMessage());
			return 0;
		}
	}

	public boolean checkPassword(String userId, String inputPassword) {
		Member member = memberRepository.findByEmail(userId)
				.orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다.")).toDto();
		log.info("checkPassword() : " + member);

		return bCryptPasswordEncoder.matches(inputPassword, member.getPw());
	}


//	@Transactional
//	public int deleteMember(String userId) {
//		try {   //리턴 타입을 int 로 맞추기 위해서 처리함
//			//deleteById() -> 리턴 타입이 void 임
//			//전달인자인 userid 가 null 인 경우 IllegalArgumentException 발생함
//			memberRepository.deleteById(userId);
//			return 1;
//		} catch (Exception e) {
//			log.info(e.getMessage());
//			return 0;
//		}
//	}


	//관리자용 ******************************************
//	public int selectListCount() {
//		return (int)memberRepository.count();  //jpa 제공
//	}

//	public ArrayList<Member> selectList(Pageable pageable) {
//		Page<MemberEntity> entityList = memberRepository.findAll(pageable);  //jpa 제공
//		ArrayList<Member> list = new ArrayList<>();
//		//Page 안의 MemberEntity 를 Member 로 변환해서 리스트에 추가 처리함
//		for(MemberEntity entity : entityList){
//			//전체 조회이므로 관리자가 아닌 회원만 리스트에 저장함
//			if(entity.getAdminYN().equals("N")) {
//				list.add(entity.toDto());
//			}
//		}
//		return list;
//	}

	/*public Page<Member> selectList(Pageable pageable) {
		Page<MemberEntity> entityList = memberRepository.findAll(pageable);  //jpa 제공
		return entityList.map(MemberEntity::toDto); // MemberEntity의 toDto() 메서드를 사용
	}*/

//	public int updateLoginOK(String userId, String loginOk) {
//		try {
//			//이전 데이터를 가진 회원정보를 조회해 옴 (수정전)
//			Member updateMember = memberRepository.findById(userId).get().toDto();
//			//전달받은 객체에서 loginOk 정보만 수정할 것이므로, 수정할 값으로 변경함
//			updateMember.setLoginOk(loginOk);
//			//수정할 객체를 가진 회원정보를 jpa 로 넘김
//			memberRepository.save(updateMember.toEntity());  //jpa 제공
//			return 1;
//		}catch (Exception e) {
//			log.error(e.getMessage());
//			return 0;
//		}
//	}

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
